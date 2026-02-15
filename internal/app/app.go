package app

import (
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
	"github.com/Palmer-Lab-UCSD/gview/internal/service"
)

type App struct {
	Cfg 	*config.Config
	Db   	*service.OrgDb
	Auth 	*service.Authenticate
	Log  	*logger.AppLogger
}


func Init(cfg *config.Config) (*App, error) {
	app := new(App)

	app.Cfg = cfg

	var err error
	if app.Db, err = service.DbInit(cfg.Db); err != nil {
		return nil, err
	}

	//if app.Auth, err = service.AuthInit(cfg.Auth); err != nil {
	//	return nil, err
	//}

	if app.Log, err = logger.LoggerInit(cfg.Log); err != nil {
		return nil, err
	}

	return app, nil
}
