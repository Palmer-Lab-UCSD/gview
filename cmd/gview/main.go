// Launch the application
//
package main

// "github.com/Palmer-Lab-UCSD/gview/internal/api"

import (
	"fmt"
	"net/http"
	"os"
    "path/filepath"

	"github.com/Palmer-Lab-UCSD/gview/internal/application"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/ui"
)

func main() {

    // Set up server variables
    // -c   print log to server standard out
    // --config path to server configuration file
    // --root directory fo webservice, default "GVIEW_ROOT"
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

    fmt.Printf("Environment: %s\n", cfg.ConfigName)
    fmt.Printf("HostName:Port: %s%s\n",
            cfg.Networt.HostName,
            cfg.Network.Port)

	mux := http.NewServeMux()

	// Landing page provides interface for logging in, that is it
	mux.HandleFunc("GET /", ui.HomeHandlerFunc(app))
    // mux.HandleFunc("/user", api.UserFunc(app))
	// mux.HandleFunc("/logout", api.HandleLogout)
	// mux.HandleFunc("/gwas", api.GwasHandlerFunc(app))
	// mux.HandleFunc("/hwas", api.HwasHandlerFunc(app))
	// mux.HandleFunc("/api/gwas/", api.GwasApiHandlerFunc(app))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(cfg.Ui.StaticDir))))


    if cfg.ConfigName == "dev" {
        app.Log.Fatal(http.ListenAndServe(cfg.Network.Port, mux))
    } else if cfg.ConfigName == "prod" {
        return 
//	mgr := &autocert.Manager{
//		// Accept Let's Encrypts' terms of service
//		Prompt: autocert.AcceptTOS,
//
//		// Caching certificates
//		Cache: autocert.DirCache(CACHE_DIR),
//
//		// Exclusive set of domains to serve
//		HostPolicy: autocert.HostWhitelist(URL),
//	}
//
//	app.Log.Fatal(http.Serve(mgr.Listener(), mux))
//
//	app.Log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%s", cfg.HostName, cfg.Port),
//		mux))
    }
}
