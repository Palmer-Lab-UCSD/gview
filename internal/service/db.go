package service

import (
	"database/sql"
	"errors"
	"fmt"
	"math"
	"os"

	_ "github.com/lib/pq"
	"github.com/palmer-lab-ucsd/gview/internal/config"
)

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

// OrgDb is an alias of sql.DB.  I wanted to include this to
// reinforce the idea that the interactions with the database
// assume the specific database architecture
type OrgDb struct {
	*sql.DB
}

func (db *OrgDb) isValidSchema(schema string) error {

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

func (db *OrgDb) isValidTable(schema string, table string) error {
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
			&tmp.Pval)
		if err != nil {
			return make([]GwasLocusRecord, 0), err
		}

		tmp.NegLogPval = -math.Log10(tmp.Pval)
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

func mkDbLoginStr(dbCfg *config.DatabaseConfig) string {
	s := fmt.Sprintf("dbname=%s host=%s port=%s sslmode=%s",
		dbCfg.Name,
		dbCfg.HostName,
		dbCfg.Port,
		dbCfg.SslMode)
	var val string

	if val = os.Getenv(dbCfg.UserEnvVar); val != "" {
		s = fmt.Sprintf("%s user=%s", s, val)
	}

	if val = os.Getenv(dbCfg.PasswdEnvVar); val != "" {
		s = fmt.Sprintf("%s password=%s", s, val)
	}

	if dbCfg.SslCert != "" {
		s = fmt.Sprintf("%s sslcert=%s", s, dbCfg.SslCert)
	}

	if dbCfg.SslKey != "" {
		s = fmt.Sprintf("%s sslkey=%s", s, dbCfg.SslKey)
	}

	if dbCfg.SslRootCert != "" {
		s = fmt.Sprintf("%s sslrootcert=%s", s, dbCfg.SslRootCert)
	}

	if dbCfg.ConnectionTimeOut != "" {
		s = fmt.Sprintf("%s connection_timeout=%s", s, dbCfg.SslKey)
	}

	return s
}

func open(dbCfg *config.DatabaseConfig) (*OrgDb, error) {

	db, err := sql.Open(dbCfg.Driver, mkDbLoginStr(dbCfg))
	if err != nil {
		return nil, err
	}
	orgDb := &OrgDb{DB: db}

	if err != nil {
		return nil, err
	}

	return orgDb, nil
}

func DbInit(dbCfg *config.DatabaseConfig) (*OrgDb, error) {
	db, err := open(dbCfg)
	if err != nil {
		return nil, err
	}
	return db, nil
}
