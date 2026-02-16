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

	"github.com/Palmer-Lab-UCSD/gview/internal/app"
	"github.com/Palmer-Lab-UCSD/gview/internal/api"
)

const (
    EXIT_SERVER_ERROR = 1
    EXIT_APP_ERROR = 2
    EXIT_API_ERROR = 3
)


func main() {

    var err error
    var mux *http.ServeMux = http.NewServeMux()

    if err = app.SetUpApp(args, mux); err != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err)
        os.Exit(EXIT_APP_ERROR)
    }

    if err = api.SetUpApi(app, mux); err != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err)
        os.Exit(EXIT_API_ERROR)
    }

    if err = http.ListenAndServe(app.Network., mux); err != nil {
        fmt.Fprintf(os.Stderr, "%s\n", err)
        os.Exit(EXIT_ON_ERROR)
    }

    fmt.Fprintf(os.Stdout, "SERVER STOPED WITHOUT ERROR.")
}
