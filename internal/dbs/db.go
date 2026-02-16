package service

import (
	"database/sql"
	"errors"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)

// DataDb is an alias of sql.DB.  I wanted to include this to
// reinforce the idea that the interactions with the database
// assume the specific database architecture
type Db interface {
	*sql.DB
}

func mkDbLoginStr(networkCfg *config.DatabaseNetwork, 
                dbCfg *config.DatabaseConfig) string {
s := fmt.Sprintf("dbname=%s host=%s port=%s sslmode=%s",
		dbCfg.Name,
		networkCfg.HostName,
		networkCfg.Port,
		networkCfg.SslMode)
	var val string

	if val = os.Getenv(dbCfg.UserEnvVar); val != "" {
		s = fmt.Sprintf("%s user=%s", s, val)
	}

	if val = os.Getenv(dbCfg.PasswdEnvVar); val != "" {
		s = fmt.Sprintf("%s password=%s", s, val)
	}

	if networkCfg.SslCert != "" {
		s = fmt.Sprintf("%s sslcert=%s", s, networkCfg.SslCert)
	}

	if networkCfg.SslKey != "" {
		s = fmt.Sprintf("%s sslkey=%s", s, networkCfg.SslKey)
	}

	if networkCfg.SslRootCert != "" {
		s = fmt.Sprintf("%s sslrootcert=%s", s, networkCfg.SslRootCert)
	}

	if networkCfg.ConnectionTimeOut != "" {
		s = fmt.Sprintf("%s connection_timeout=%s", s, networkCfg.SslKey)
	}

	return s
}

// I need to  update all database connecctions to meet the new 
// more generalized approach

func OpenDbConn(db *Db,
            networkCfg *config.DatabaseNetwork,
            dbCfg *config.DatabaseConfig) error {

	db.DB, err := sql.Open(networkCfg.Driver, mkDbLoginStr(networkCfg, dbCfg))
	if err != nil {
		return err
	}
    return nil
}
