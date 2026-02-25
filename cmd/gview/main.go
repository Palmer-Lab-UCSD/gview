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
    "errors"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/logger"
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

    logsToStdout, configFilename := argParser()

    var err error

    var cfg *config.Config
    var logs *logger.AppLogger
    var errTmpl *ui.GviewTemplate

    cfg, err = config.InitConfig(logsToStdout, configFilename)
	if err != nil {
        fmt.Fprintf(os.Stderr,
        "ERROR: failed initalizing config, %s\n", err)
        os.Exit(1)
	}

    logs, err = logger.InitLogger(cfg.Log)
	if err != nil {
        fmt.Fprintf(os.Stderr,
        "ERROR: failed initalizing logger, %s\n", err)
        os.Exit(1)
	}

    errTmpl, err = ui.InitTemplate(cfg.Ui.TemplatesDir, "error")
	if err != nil {
        fmt.Fprintf(os.Stderr,
        "ERROR: failed initalizing error template, %s\n", err)
        os.Exit(1)
	}

    var appSettings *app.App = &app.App{Cfg: cfg, Log: logs, ErrTmpl: errTmpl}

    // Instantiate Authentication API http multiplexer, instantiation
    // includes establishing a connect to the auth postgres database
    //
    // Rememer that http.ServeMux satisfies the http.Handler interface
    var apiAuthRoutes *http.ServeMux
    apiAuthRoutes, err = api.AuthRoutes(cfg.Db["AuthDb"], cfg.Auth, logs)
    if err != nil {
        fmt.Fprintf(os.Stderr,
        "ERROR: failed initalizing auth database, %s\n", err)
        os.Exit(2)
    }

    // Instantiate Visualization API http multiplexer, instantiation
    // includes establishing a connect to the data postgres database
    var apiVisRoutes *http.ServeMux
    apiVisRoutes, err = api.VisRoutes(cfg.Db["DataDb"], cfg.Vis, logs)
    if err != nil {
        fmt.Fprintf(os.Stderr,
        "ERROR: failed initalizing auth database, %s\n", err)
        os.Exit(2)
    }

    var mux *http.ServeMux = http.NewServeMux()

    mux.Handle("/", app.Routes(appSettings))
    mux.Handle("/api/auth", apiAuthRoutes)
    mux.Handle("/api/vis", apiVisRoutes)


    var addr string = fmt.Sprintf("%s:%s",
        app.Cfg.Network.HostName,
        app.Cfg.Network.Port)


    var srv http.Server

    if appSettings.cfg.ConfigName == "prod" {
        fmt.Fprintf(os.Stderr, "ERROR: prod app not ready")
        os.Exit(2)
        // TODO HEADER for https only Strict-Transport-Security: max-age=604800
        // srv = http.Server{
        //     Addr: addr,
        //     ReadHeaderTimeout: cfg.Network.ReadHeaderTimeout * time.Seconds,
        //     ReadTimeout: cfg.Network.Readtimeout * time.Seconds,
        //     WriteTimeout: cfg.Network.WriteTimeout * time.Seconds,
        //     IdleTimeout: cfg.Network.IdleTimeout * time.Seconds,
        //     Handler: mux,
        }
    } else {
        srv = http.Server{
            Addr: addr,
            ReadHeaderTimeout: cfg.Network.ReadHeaderTimeout * time.Seconds,
            ReadTimeout: cfg.Network.Readtimeout * time.Seconds,
            WriteTimeout: cfg.Network.WriteTimeout * time.Seconds,
            IdleTimeout: cfg.Network.IdleTimeout * time.Seconds,
            Handler: mux,
        }

        if srv.ListenAndServe() != nil {
            fmt.Fprintf(os.Stderr, "%s\n", err)
            os.Exit(EXIT_SERVER_ERROR)
        }
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
