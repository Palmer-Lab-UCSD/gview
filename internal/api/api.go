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
	DataDb 	*dbs.DataDb
    AuthDb  *dbs.AuthDb
	Log  	*logger.AppLogger
}

func Routing(cfg *config.Config) *http.ServeMux {
    var err error
    var mux *http.ServeMux = http.NewServeMux()

    var api *Api

	var mux *http.ServeMux = http.NewServeMux()
    mux.HandleFunc("POST /api/auth/isSignInValid", signInFunc(api))
    mux.HandleFunc("POST /api/auth/isValidSession", sessionFunc(api))

    // mux.HandleFunc("/api/gwas", makeGwasHandlerFunc())
    // mux.HandleFunc("/api/hwas", makeHwasHandlerFunc())

    return mux
}

