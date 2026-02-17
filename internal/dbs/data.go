package dbs

import (
	"database/sql"
	"errors"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)

const (
	NBINS       int = 1000
	BIN_BUFSIZE int = 100 * NBINS
)

type GeneAnnotationRecord struct {
	Id                uint64 `json:"id"`
	Chr               string `json:"chr"`
	Refseq            string
	Feature           string
	Start             uint64 `json:"start"`
	End               uint64 `json:"end"`
	Strand            string `json:"strand"`
	GeneId            string
	TranscriptId      string
	Product           string
	GeneBiotype       string
	TranscriptBiotype string
}

type GwasLocusRecord struct {
	Chr        string
	Snp        string
	Pos        uint
	Allele1    string
	Allele2    string
	Freq       float32
	EffectSize float32
	StdError   float32
	Pval       float64
	NegLogPval float64
}

type GwasChrWideViewRecord struct {
	Chr        string
	Pos        uint64
	NegLogPval float32
}

type ChrStats struct {
	Length uint64
	Start  uint64
	End    uint64
}

// Satisfies the Db interface definition
type DataDb struct {
    *sql.DB
}

func (db *DataDb) isValidSchema(schema string) error {

	row := db.QueryRow(`
			SELECT EXISTS
				(SELECT * FROM projs WHERE name = $1)
			AND EXISTS 
				(SELECT * FROM information_schema.schemata 
				WHERE schema_name = $1);
		`, schema)

	var schemaExists bool

	if err := row.Scan(&schemaExists); err != nil {
		return err
	} else if !schemaExists {
		return errors.New("schmea does not exist")
	}

	return nil
}

func (db *DataDb) isValidTable(schema string, table string) error {
	row := db.QueryRow(`
			SELECT EXISTS
				(SELECT * FROM projs WHERE name = $1)
			AND EXISTS 
				(SELECT * FROM information_schema.tables
				WHERE table_schema = $1 AND table_name = $2);
		`, schema, table)

	var tableExists bool
	if err := row.Scan(&tableExists); err != nil {
		return err
	} else if !tableExists {
		return errors.New("table does not exist")
	}
	return nil
}

func ProcessGwasRecords(rows *sql.Rows) ([]GwasLocusRecord, error) {
	var tmp GwasLocusRecord
	var err error
	output := make([]GwasLocusRecord, 0, 1000000)
	var i int
	for i = 0; rows.Next(); i++ {
		err = rows.Scan(&tmp.Chr,
			&tmp.Snp,
			&tmp.Pos,
			&tmp.Allele1,
			&tmp.Allele2,
			&tmp.Freq,
			&tmp.EffectSize,
			&tmp.StdError,
			&tmp.Pval,
			&tmp.NegLogPval)
		if err != nil {
			return make([]GwasLocusRecord, 0), err
		}
		output = append(output, tmp)
	}

	return output, nil
}

func ProcessRowsAsStrings(rows *sql.Rows) []string {
	output := make([]string, 0, 1000)
	tmp := new(string)

	var i int
	for i = 0; rows.Next(); i++ {
		rows.Scan(tmp)
		output = append(output, *tmp)
	}
	return output

}

func GetProjectIds(db *DataDb) ([]string, error) {

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
func GetPhenotypes(db *DataDb,
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

func GetChrom(db *DataDb,
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

func GetLocusAtMaxAssoc(db *DataDb,
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

func GetGwasAllLociRecords(db *DataDb,
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

func GetGwasBoundedLociRecords(db *DataDb,
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

func GetChrWideSubset(db *DataDb,
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

func GetGenes(db *DataDb,
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
	db *DataDb) (*ChrStats, error) {

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
