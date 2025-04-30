package service

import (
	"errors"
	"fmt"
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
	start uint,
	stop uint) ([]GwasLocusRecord, error) {

	var err error
	if err = db.isValidTable(schema, table); err != nil {
		return make([]GwasLocusRecord, 0), err
	}

	q := fmt.Sprintf("SELECT * FROM %s.%s WHERE chr = $1 AND pos >= $2 AND pos < $3;",
		schema, table)

	rows, err := db.Query(q, chr, start, stop)
	if err != nil {
		return make([]GwasLocusRecord, 0), err
	}
	defer rows.Close()

	return ProcessGwasRecords(rows)
}
