package api

import (
	"fmt"
	"os"
    "net/http"
    "flag"
    "path/filepath"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
)



type AuthApi {
    Db      *dbs.Db
    Log     *logger.AppLogger
    Cfg     *config.AuthConfig
}

type VisApi {
    Db      *dbs.Db
    Log     *logger.AppLogger
    Cfg     *config.VisConfig
}


// How to configure auth vs lz patyhs
func AuthConfig(dbCfg *config.DatabaseConfig, 
    cfg *config.AuthConfig, 
    log *logger.AppLogger) (*http.ServeMux, error) {

    var err error 
    var authApi *AuthApi = &{Db: new(dbs.Db), Cfg: cfg, Log: log}

    err = dbs.OpenDbConn(authApi.Db, dbCfg)
    if err != nil {
        return nil, err
    }

	var mux *http.ServeMux = http.NewServeMux()

    mux.HandleFunc("POST /api/auth/isValidSignIn", signInFunc(authApi))
    // mux.HandleFunc("POST /api/auth/isSession/{user_id}",
    //    sessionFunc(authApi))

    // mux.HandleFunc("/api/data/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/data/hwas", makeHwasHandlerFunc())

    return mux, nil
}


func InitVisMux(dbCfg *config.DatabaseConfig,
    cfg *config.VisConfig,
    log *logger.AppLogger) (*http.ServeMux, error) {

    var err error
    var visApi *VisApi = &{Db: new(dbs.Db), Cfg: cfg, Log: log}

    err = dbs.OpenDbConn(visApi.Db, dbCfg)
    if err != nil {
        return nil, err
    }

	var mux *http.ServeMux = http.NewServeMux()

    // mux.HandleFunc("/api/vis/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/data/hwas", makeHwasHandlerFunc())

    return mux
}

