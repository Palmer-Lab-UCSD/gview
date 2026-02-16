package app

import (
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
	"github.com/Palmer-Lab-UCSD/gview/internal/service"
)

type App struct {
	Cfg 	*config.Config
	DataDb 	*service.DataDb
    AuthDb  *service.AuthDb
	Auth 	*service.Authenticate
	Log  	*logger.AppLogger
}


func Init(cfg *config.Config) (*App, error) {
	app := new(App)

	app.Cfg = cfg

	var err error
	app.DataDb, err = service.OpenDbConn(cfg.Db.NetworkSettings, cfg.Db.DataDb)
	if err != nil {
		return nil, err
	}

	app.Auth, err = service.OpenDbConn(cfg.Db.NetworkSettings, cfg.Db.AuthDb)
	if err != nil {
		return nil, err
	}

	if app.Log, err = logger.LoggerInit(cfg.Log); err != nil {
		return nil, err
	}

	return app, nil
}
