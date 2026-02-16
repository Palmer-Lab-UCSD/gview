// The app package is the centerpiece of the gview web application
// 
// The gview web application needs to coordinate services provided by
// the API, database, and user interface.  The app package stores the
// required configuration and delegates requests that are submitted
// to the server.  It then packages the results and sends a response.
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
	"github.com/Palmer-Lab-UCSD/gview/internal/dbs"
    "github.com/Palmer-Lab-UCSD/gview/internal/api"
)


// App structs holds information required for running the application,
// and is meant to be passed to services
type App struct {
	Cfg 	*config.Config
	DataDb 	*dbs.DataDb
    AuthDb  *dbs.AuthDb
	Log  	*logger.AppLogger
}


func initApp(args *Args) (*App, error) {
	var err error
	var app *App = new(App)

	app.Cfg, err := config.InitConfig(args)
	if err != nil {
        return err
	}

	if app.Log, err = logger.InitLogger(cfg.Log); err != nil {
		return nil, err
	}

	app.DataDb, err = dbs.OpenDbConn(cfg.Db.NetworkSettings,
        cfg.Db.DataDb)
	if err != nil {
		return nil, err
	}

	app.AuthDb, err = dbs.OpenDbConn(cfg.Db.NetworkSettings,
        cfg.Db.AuthDb)
	if err != nil {
		return nil, err
	}

	return app, nil
}


func SetUpApp(args *Args) error {
    var app *App
	if app, err := initApp(args); err != nil {
        return err
	}

	var mux *http.ServeMux = http.NewServeMux()

    if err := webAppMux(mux, app); err != nil {
        return err
    }

    if err := api.apiMux(mux); err != nil {

    }

    
    if cfg.ConfigName == "dev" {
        return http.ListenAndServe(cfg.Network.Port, mux)
    } else if cfg.ConfigName == "prod" {
        return error("Prod server not configured")
    }

    return error("Unkown configuration")
}
