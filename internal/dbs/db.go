package dbs

import (
	"database/sql"
	"errors"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)

type Db struct{
	*sql.DB
}

func mkDbLoginStr(dbCfg *config.DatabaseConfig) string {
    s := fmt.Sprintf("dbname=%s host=%s port=%s sslmode=%s",
		dbCfg.Name,
		dbCfg.NetworkSettings.HostName,
		dbCfg.NetworkSettings.Port,
		dbCfg.NetworkSettings.SslMode)
	var val string

	if val = os.Getenv(dbCfg.UserEnvVar); val != "" {
		s = fmt.Sprintf("%s user=%s", s, val)
	}

	if val = os.Getenv(dbCfg.PasswdEnvVar); val != "" {
		s = fmt.Sprintf("%s password=%s", s, val)
	}

	if dbCfg.NetworkSettings.SslCert != "" {
		s = fmt.Sprintf("%s sslcert=%s", s, dbCfg.NetworkSettings.SslCert)
	}

	if dbCfg.NetworkSettings.SslKey != "" {
		s = fmt.Sprintf("%s sslkey=%s", dbCfg.NetworkSettings.SslKey)
	}

	if dbCfg.NetworkSettings.SslRootCert != "" {
		s = fmt.Sprintf("%s sslrootcert=%s", s, dbCfg.NetworkSettings.SslRootCert)
	}

	if db.NetworkSettings.ConnectionTimeOut != "" {
		s = fmt.Sprintf("%s connection_timeout=%s", s, dbCfg.NetworkSettings.SslKey)
	}

	return s
}

// I need to  update all database connecctions to meet the new 
// more generalized approach

func OpenDbConn(db *Db, dbCfg *config.DatabaseConfig) error {

	db.DB, err := sql.Open(db.Cfg.NetworkSettings.Driver, mkDbLoginStr(dbCfg))
	if err != nil {
		return err
	}

    // verify database connection
    err = db.Ping()
    if err != nil {
        return err
    }
    return nil
}
