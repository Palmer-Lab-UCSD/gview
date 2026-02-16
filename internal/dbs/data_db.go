package service

import (
	"database/sql"
	"errors"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
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

