// Launch the application

package main

import (
	"fmt"
	"net/http"
	"os"
    "path/filepath"

	"gview/internal/api"
	"gview/internal/application"
	"gview/internal/config"
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
    mux.HandleFunc("/user", api.UserFunc(app))
	mux.HandleFunc("/logout", api.HandleLogout)
	// mux.HandleFunc("/gwas", api.GwasHandlerFunc(app))
	// mux.HandleFunc("/hwas", api.HwasHandlerFunc(app))
	// mux.HandleFunc("/api/gwas/", api.GwasApiHandlerFunc(app))

	mux.Handle("/public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(filepath.Join(cfg.RootDir, "public/static")))))

	mgr := &autocert.Manager{
		// Accept Let's Encrypts' terms of service
		Prompt: autocert.AcceptTOS,

		// Caching certificates
		Cache: autocert.DirCache(CACHE_DIR),

		// Exclusive set of domains to serve
		HostPolicy: autocert.HostWhitelist(URL),
	}

	app.Log.Fatal(http.Serve(mgr.Listener(), mux))

	app.Log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", cfg.HostName, cfg.Port),
		mux))
}
