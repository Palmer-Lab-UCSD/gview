// gview
// 
// 2026 Palmer Lab
//
// "app" package manages user web interface
// 
// Required web application resources are:
//      * logger
//      * ui configuration
//      * api endpoint urls:
//          * authentication
//          * rat genetic data and analyses
//
//
//
package app

import (
	"net/http"
    "html/template"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
	mw "github.com/Palmer-Lab-UCSD/gview/internal/middleware"
)



type App struct {
    Vis         *config.VisConfig
    Ui          *config.UiConfig
    Log         *logger.AppLogger
    ErrTmpl     *template.Template
}


func Routes(cfg *config.Config,
    log *logger.AppLogger,
    errTmpl *template.Template) (*http.ServeMux, error) {

    appd := &App{Vis: cfg.Vis, Ui: cfg.Ui, Log: log, ErrTmpl: errTmpl}

	var mux *http.ServeMux = http.NewServeMux()

	mux.HandleFunc("GET /", mw.SessionAuth(makeHomePageFunc(appd)))
	mux.HandleFunc("GET /signIn", mw.SessionAuth(makeSignInPageFunc(appd)))
	mux.HandleFunc("GET /workspace/{user_id}",
        makeWorkspacePageFunc(appd))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(appd.Cfg.Ui.StaticDir))))

    return mux, nil
}

