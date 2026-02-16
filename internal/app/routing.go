package app

import (
	"fmt"
	"net/http"
	"os"

    "github.com"
)

func webAppMux(mux *http.ServeMux, app *App) error {

	// Landing page provides interface for logging in, that is it
	mux.HandleFunc("GET /", makeHomeFunc(app))
	mux.HandleFunc("GET /signIn", makeSignInFunc(app))
    mux.HandleFunc("GET /error", makeErrorHandler)



    // mux.HandleFunc("/user", api.UserFunc(app))
	// mux.HandleFunc("/logout", api.HandleLogou)
	// mux.HandleFunc("/gwas", api.GwasHandlerFunc(app))
	// mux.HandleFunc("/hwas", api.HwasHandlerFunc(app))
	// mux.HandleFunc("/api/gwas/", api.GwasApiHandlerFunc(app))

	mux.Handle("GET /public/static/",
		http.StripPrefix("/public/static",
			http.FileServer(http.Dir(cfg.Ui.StaticDir))))

    return mux, nil
}

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

