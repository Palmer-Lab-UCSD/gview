// Launch the web server 
//
// ARGUMENTS
//
// -c   print log to server standard out
// --config path to server configuration file

package main


import (
	"fmt"
	"os"
    "net/http"
    "flag"
    "path/filepath"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/app"
	"github.com/Palmer-Lab-UCSD/gview/internal/api"
)

const (
    EXIT_SERVER_ERROR = 1
    DEFAULT_ROOT = "."
)


func argParser() (bool, string) {

    var logsToStdout bool
	flag.BoolVar(&logsToStdout, "c", false,
		"Print the log to standard out")

    defaultConfigFile := filepath.Join(DEFAULT_ROOT, "internal", "config",
        "dev.json")

    var configFilename string
	flag.StringVar(&configFilename, "config", defaultConfig,
		"Path and name of server configuration file.")

	flag.Parse()

	return logsToStdout, configFilename
}


func main() {


    var err error
    var cfg *config.Config
    logsToStdout, configFilename := argParser()
    cfg, err = config.InitConfig(logsToStdout, configFilename)

    var mux *http.ServeMux = http.NewServeMux()

    mux.Handle("/", app.Routes(cfg))
    mux.Handle("/api", api.Routes(cfg))


    var addr string = fmt.Sprintf("%s:%s",
        cfg.Network.HostName,
        cfg.Network.Port)

    if cfg.ConfigName != "prod" {
        err = error("Prod server not yet established")
    } else {
        err = http.ListenAndServe(addr, mux); err != nil {
    }

    if err != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err)
        os.Exit(EXIT_SERVER_ERROR)
    }

    fmt.Fprintf(os.Stdout, "SERVER STOPED WITHOUT ERROR.")
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
