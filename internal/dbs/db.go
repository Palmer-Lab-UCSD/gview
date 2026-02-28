package dbs

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)

func mkDbLoginStr(dbCfg *config.DatabaseConfig) string {
    s := fmt.Sprintf("dbname=%s host=%s port=%s sslmode=%s",
		dbCfg.Name,
		dbCfg.Connection.HostName,
		dbCfg.Connection.Port,
		dbCfg.Connection.SslMode)
	var val string

	if val = os.Getenv(dbCfg.UserEnvVar); val != "" {
		s = fmt.Sprintf("%s user=%s", s, val)
	}

	if val = os.Getenv(dbCfg.PasswdEnvVar); val != "" {
		s = fmt.Sprintf("%s password=%s", s, val)
	}

	if dbCfg.Connection.SslCert != "" {
		s = fmt.Sprintf("%s sslcert=%s", s, dbCfg.Connection.SslCert)
	}

	if dbCfg.Connection.SslKey != "" {
		s = fmt.Sprintf("%s sslkey=%s", dbCfg.Connection.SslKey)
	}

	if dbCfg.Connection.SslRootCert != "" {
		s = fmt.Sprintf("%s sslrootcert=%s", s, dbCfg.Connection.SslRootCert)
	}

	if dbCfg.Connection.ConnectionTimeOut != "" {
		s = fmt.Sprintf("%s connection_timeout=%s", s, dbCfg.Connection.SslKey)
	}

	return s
}

// I need to  update all database connecctions to meet the new 
// more generalized approach

func OpenDbConn(dbCfg *config.DatabaseConfig) (sql.DB, error) {

	sqlDB, err := sql.Open(dbCfg.Connection.Driver, mkDbLoginStr(dbCfg))
	if err != nil {
		return nil, err
	}

    // verify database connection
    err = sqlDB.Ping()
    if err != nil {
        return nil, err
    }
    return sqlDB, nil
}
