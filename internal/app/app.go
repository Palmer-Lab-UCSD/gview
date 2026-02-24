// The app package manages user web interface
// 
// 2026 Palmer Lab
//
package app

import (
    "errors"
	"fmt"
	"net/http"
	"os"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
	"github.com/Palmer-Lab-UCSD/gview/internal/ui"
)

type HandleFunc func(http.ResponseWriter, *http.Request)


type App struct {
    Cfg         *config.Config
    Log         *log.Logger
    ErrTmpl     *ui.GviewTemplate
}


func InitApp(cfg *config.Config,
    log *logger.AppLogger, 
    errTmpl *ui.GviewTemplate) *App {

    // appd is short hand for app data
    var appd *App = new(App)

    appd.Cfg = cfg
	appd.Log = logs
    appd.ErrTmpl = errTmpl

    return appd
}


func Routes(appd *App) *http.ServeMux {
    var err error

	var mux *http.ServeMux = http.NewServeMux()

	mux.HandleFunc("GET /", makeHomePageFunc(appd))
	mux.HandleFunc("GET /signIn", makeSignInPageFunc(appd))
	mux.HandleFunc("GET /workspace/{user_id}", makeWorkspacePageFunc(appd))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(appd.Cfg.Ui.StaticDir))))

    return mux
}

