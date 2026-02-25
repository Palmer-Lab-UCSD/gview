// The app package manages user web interface
// 
// 2026 Palmer Lab
//
package app

import (
	"net/http"
    "html/template"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
)



type App struct {
    Cfg         *config.Config
    Log         *logger.AppLogger
    ErrTmpl     *template.Template
}


func InitApp(cfg *config.Config,
    log *logger.AppLogger, 
    errTmpl *template.Template) *App {

    // appd is short hand for app data
    var appd *App = new(App)

    appd.Cfg = cfg
	appd.Log = log
    appd.ErrTmpl = errTmpl

    return appd
}


func Routes(appd *App) *http.ServeMux {
	var mux *http.ServeMux = http.NewServeMux()

	mux.HandleFunc("GET /", makeHomePageFunc(appd))
	mux.HandleFunc("GET /signIn", makeSignInPageFunc(appd))
	mux.HandleFunc("GET /workspace/{user_id}", makeWorkspacePageFunc(appd))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(appd.Cfg.Ui.StaticDir))))

    return mux
}

