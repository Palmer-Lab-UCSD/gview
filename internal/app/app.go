// The app package manages user web interface
// 
// 2026 Palmer Lab
//
package app

import (
    "error"
	"fmt"
	"net/http"
	"os"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
)


// App structs holds information required for running the application,
// and is meant to be passed to services


func Routing(cfg *config.Config) *http.ServeMux {
    var err error
    var logs *logger.AppLogger

    logs, err = logger.InitLogger(cfg)
	var mux *http.ServeMux = http.NewServeMux()

	mux.HandleFunc("GET /", makeHomeFunc(logs))
	mux.HandleFunc("GET /signIn", makeSignInFunc(logs))
	mux.HandleFunc("GET /workspace", makeWorkspaceFunc(logs))
    mux.HandleFunc("GET /error", makeErrorHandler(logs))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(cfg.Ui.StaticDir))))

    return mux
}
