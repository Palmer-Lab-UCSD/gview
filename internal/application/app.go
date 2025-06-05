package application

import (
	"gview/internal/config"
	"gview/internal/logger"
	"gview/internal/service"
)

type Application struct {
	Cfg 	*config.Config
	Db   	*service.OrgDb
	Auth 	*service.Authenticate
	Log  	*logger.AppLogger
}


func Init(cfg *config.Config) (*Application, error) {
	app := new(Application)

	app.Cfg = cfg

	var err error
	if app.Db, err = service.DbInit(cfg.Db); err != nil {
		return nil, err
	}

	if app.Auth, err = service.AuthenticatorInit(); err != nil {
		return nil, err
	}

	if app.Log, err = logger.LoggerInit(cfg.Log); err != nil {
		return nil, err
	}

	return app, nil
}
