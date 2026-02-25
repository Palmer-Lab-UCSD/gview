package api

import (
	"fmt"
	"os"
    "net/http"
    "flag"
    "path/filepath"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
	"github.com/Palmer-Lab-UCSD/gview/internal/dbs"
)



type AuthApi struct {
    Db      *dbs.AuthDb
    Log     *logger.AppLogger
    Cfg     *config.AuthConfig
}

type VisApi struct {
    Db      *dbs.DataDb
    Log     *logger.AppLogger
    Cfg     *config.VisConfig
}


// How to configure auth vs lz patyhs
func AuthRoutes(dbCfg *config.DatabaseConfig, 
    cfg *config.AuthConfig, 
    log *logger.AppLogger) (*http.ServeMux, error) {

    var err error 
    var authApi *AuthApi = new(AuthApi)
    authApi.Db, err = dbs.OpenAuthDbConn(dbCfg, *cfg)
    if err != nil {
        return nil, err
    }
    authApi.Log = log
    authApi.Cfg = cfg

	var mux *http.ServeMux = http.NewServeMux()

    mux.HandleFunc("POST /api/auth/verifySignIn", verifySignInFunc(authApi))
    // mux.HandleFunc("POST /api/auth/isSession/{user_id}",
    //    sessionFunc(authApi))

    // mux.HandleFunc("/api/data/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/data/hwas", makeHwasHandlerFunc())

    return mux, nil
}


func VisRoutes(dbCfg *config.DatabaseConfig,
    cfg *config.VisConfig,
    log *logger.AppLogger) (*http.ServeMux, error) {

    var err error
    var visApi *VisApi = new(VisApi)

    visApi.Db, err = dbs.OpenDataDbConn(dbCfg)
    if err != nil {
        return nil, err
    }
    visApi.Cfg = cfg
    visApi.Log = log

	var mux *http.ServeMux = http.NewServeMux()

    // mux.HandleFunc("/api/vis/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/data/hwas", makeHwasHandlerFunc())

    return mux, nil
}

