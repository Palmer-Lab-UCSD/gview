package service

import (
	"errors"
	"fmt"
)

const (
	NBINS       int = 1000
	BIN_BUFSIZE int = 100 * NBINS
)

func GetProjectIds(db *OrgDb) ([]string, error) {

	// TODO need to add check that the schema exists in information_schema
	rows, err := db.Query("SELECT name FROM projs;")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	output := ProcessRowsAsStrings(rows)
	if len(output) == 0 {
		return output, errors.New("no project ids found")
	}
	return output, nil
}

// Asks for phenotype in table: <schema>.results
func GetPhenotypes(db *OrgDb,
	schema string) ([]string, error) {

	var err error
	if err = db.isValidSchema(schema); err != nil {
		return make([]string, 0), err
	}

	q := fmt.Sprintf("SELECT phenotype FROM %s.results;", schema)
	rows, err := db.Query(q)
	if err != nil {
		tmp := make([]string, 0)
		return tmp, err
	}
	defer rows.Close()

	output := ProcessRowsAsStrings(rows)
	if len(output) == 0 {
		return output, errors.New("no phenotype records found")
	}
	return output, nil
}

func GetChrom(db *OrgDb,
	schema string,
	table string) ([]string, error) {

	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return make([]string, 0), err
	}

	q := fmt.Sprintf("SELECT chr FROM %s.%s GROUP BY chr;", schema, table)
	rows, err := db.Query(q)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	output := ProcessRowsAsStrings(rows)
	if len(output) == 0 {
		return output, errors.New("no chromosome records found")
	}
	return output, nil
}

func GetLocusAtMaxAssoc(db *OrgDb,
	schema string,
	table string,
	chr string) (uint64, error) {

	var out uint64
	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return out, err
	}

	q := fmt.Sprintf(`SELECT Pos FROM %s.%s WHERE chr = $1
		AND NegLogPval
		= (SELECT max(NegLogPval) FROM %s.%s WHERE chr = $1);`,
		schema, table, schema, table)

	row := db.QueryRow(q, chr)
	err = row.Scan(&out)
	if err != nil {
		return out, err
	}
	return out, nil
}

func GetGwasAllLociRecords(db *OrgDb,
	schema string,
	table string,
	chr string) ([]GwasLocusRecord, error) {

	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return make([]GwasLocusRecord, 0), err
	}

	q := fmt.Sprintf("SELECT * FROM %s.%s WHERE chr = $1;",
		schema, table)
	rows, err := db.Query(q, chr)
	if err != nil {
		return make([]GwasLocusRecord, 0), err
	}
	defer rows.Close()

	return ProcessGwasRecords(rows)
}

func GetGwasBoundedLociRecords(db *OrgDb,
	schema string,
	table string,
	chr string,
	start uint64,
	end uint64) ([]GwasLocusRecord, error) {

	if start > end {
		return make([]GwasLocusRecord, 0), errors.New("start position is greater than end")
	}

	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return make([]GwasLocusRecord, 0), err
	}

	q := fmt.Sprintf("SELECT * FROM %s.%s WHERE chr = $1 AND pos >= $2 AND pos < $3;",
		schema, table)

	rows, err := db.Query(q, chr, start, end)
	if err != nil {
		return make([]GwasLocusRecord, 0), err
	}
	defer rows.Close()

	return ProcessGwasRecords(rows)
}

func GetChrWideSubset(db *OrgDb,
	schema string,
	table string,
	chr string) ([]GwasChrWideViewRecord, error) {

	place_holder := make([]GwasChrWideViewRecord, 0)

	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return place_holder, err
	}

	q := fmt.Sprintf(`WITH binned_data AS (
		SELECT chr, pos, neglogpval, ntile(%d) OVER (ORDER BY pos) AS ntile
		FROM %s.%s 
		WHERE chr = $1
		)
		SELECT b1.chr, b1.pos, b1.neglogpval
		FROM binned_data AS b1
		JOIN (
			SELECT ntile, MAX(neglogpval) AS max_neglogpval
			FROM binned_data
			GROUP BY ntile
		) AS b2 ON b1.ntile = b2.ntile AND b1.neglogpval = b2.max_neglogpval;`,
		NBINS, schema, table)

	rows, err := db.Query(q, chr)
	if err != nil {
		return place_holder, err
	}
	defer rows.Close()

	out := make([]GwasChrWideViewRecord, 0, BIN_BUFSIZE)
	var tmp GwasChrWideViewRecord

	for i := 0; rows.Next(); i++ {
		err = rows.Scan(&tmp.Chr,
			&tmp.Pos,
			&tmp.NegLogPval)

		if err != nil {
			return place_holder, err
		}

		out = append(out, tmp)
	}

	return out, nil
}

func GetGenes(db *OrgDb,
	chr string,
	start string,
	end string) ([]GeneAnnotationRecord, error) {

	place_holder := make([]GeneAnnotationRecord, 0)
	rows, err := db.Query(`SELECT * FROM data.mRatBN7_2 
		WHERE feature = 'gene' 
		AND chr = (SELECT refseq FROM data.refseqchr WHERE chr = $1)
		AND (start_pos >= $2 AND start_pos < $3
		OR 
		end_pos >= $2 AND end_pos < $3)
		ORDER BY start_pos ASC;`,
		chr, start, end)
	if err != nil {
		return place_holder, err
	}
	defer rows.Close()

	output := make([]GeneAnnotationRecord, 0, 10000)

	var tmp GeneAnnotationRecord

	var i int
	for i = 0; rows.Next(); i++ {
		err = rows.Scan(&tmp.Id,
			&tmp.Chr,
			&tmp.Feature,
			&tmp.Start,
			&tmp.End,
			&tmp.Strand,
			&tmp.GeneId,
			&tmp.TranscriptId,
			&tmp.Product,
			&tmp.GeneBiotype,
			&tmp.TranscriptBiotype)

		if err != nil {
			return place_holder, err
		}

		// Note, I think this works because make([]GeneAnnotationRecord, 0, 100)
		// allocates memory for 100 GeneAnnotationRecord structs.  So by the
		// statment below the contents of tmp, which
		// never changes its address in memory, are copied to the memory allocation
		// specified by output[i].  Consquently, when we overwrite tmp in the next iteration
		// it does not change the contents of previous slice element.  Now, if instead
		// the output was a slice of pointers to a GeneAnnotationRecord, then this would not
		// work, as each element of output points to the same position in memory as tmp, which
		// is squentially updated.
		output = append(output, tmp)
	}

	return output, nil
}

func GetChrStats(schema string,
	table string,
	chr string,
	db *OrgDb) (*ChrStats, error) {

	var chrStats ChrStats
	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return &chrStats, err
	}

	q := fmt.Sprintf("SELECT min(pos) FROM %s.%s WHERE chr = $1;",
		schema,
		table)

	row := db.QueryRow(q, chr)
	err = row.Scan(&chrStats.Start)
	if err != nil {
		return &chrStats, err
	}

	q = fmt.Sprintf("SELECT max(pos) FROM %s.%s WHERE chr = $1;",
		schema,
		table)
	row = db.QueryRow(q, chr)
	err = row.Scan(&chrStats.End)
	if err != nil {
		return &chrStats, err
	}

	chrStats.Length = chrStats.End - chrStats.Start
	if chrStats.End < chrStats.Start {
		return &chrStats, errors.New("negative or zero length chromosome is forbidden")
	}

	return &chrStats, nil
}
