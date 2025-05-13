// Launch the application

package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/palmer-lab-ucsd/gview/internal/api"
	"github.com/palmer-lab-ucsd/gview/internal/application"
	"github.com/palmer-lab-ucsd/gview/internal/config"
)

func main() {

	args := config.ParseInput()

	cfg, err := config.InitConfig(args)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	app, err := application.Init(cfg)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}

	mux := http.NewServeMux()

	// Landing page provides interface for logging in, that is it
	mux.HandleFunc("/", api.IndexHandlerFunc(app))
	mux.HandleFunc("/gwas", api.GwasHandlerFunc(app))
	mux.HandleFunc("/hwas", api.HwasHandlerFunc(app))
	mux.HandleFunc("/api/gwas/", api.GwasApiHandlerFunc(app))

	mux.Handle("/public/js/",
		http.StripPrefix("/public/js",
			http.FileServer(http.Dir(filepath.Join(cfg.RootDir, "public/js")))))

	mux.Handle("/public/css/",
		http.StripPrefix("/public/css",
			http.FileServer(http.Dir(filepath.Join(cfg.RootDir, "public/css")))))

	mux.Handle("/public/assets/",
		http.StripPrefix("/public/assets",
			http.FileServer(http.Dir(filepath.Join(cfg.RootDir, "public/assets")))))

	app.Log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", cfg.HostName, cfg.Port),
		mux))
}
