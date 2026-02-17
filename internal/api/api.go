package api

import (
	"fmt"
	"os"
    "net/http"
    "flag"
    "path/filepath"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)


type Api struct {
    Db      *dbs.Db
    Log     *logger.AppLogger
}


func initAuthApi(cfg *config.ConfigName) (*Api, error) {
	var err error
	var authApi *Api = new(Api)

	if authApi.Log, err = logger.InitLogger(cfg.Log); err != nil {
		return nil, err
	}

	authApi.Db, err = dbs.OpenDbConn(cfg.Db.NetworkSettings,
        cfg.Db.AuthDb)
	if err != nil {
		return nil, err
	}

	return authApi, nil
}


func Routing(cfg *config.Config) *http.ServeMux {
    var err error

    var authApi *Api
    authApi, err = initAuthApi(cfg)
    if err != nil {
        fmt.Fprintf(os.Stderr, "ERROR: failed to configure auth api")
        return nil
    }

    var dbApi *Api  
    dbApi, err = initDb(cfg)
    if err != nil {
        fmt.Fprintf(os.Stderr, "ERROR: failed to configure db api")
        return nil
    }

	var mux *http.ServeMux = http.NewServeMux()
    mux.HandleFunc("POST /api/auth/isSignInValid", signInFunc(authApi))
    mux.HandleFunc("POST /api/auth/isValidSession", sessionFunc(dbApi))

    // mux.HandleFunc("/api/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/hwas", makeHwasHandlerFunc())

    return mux
}

