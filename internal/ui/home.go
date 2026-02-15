package ui


import (
	"fmt"
    "net/http"
    "html/template"

    "github.com/Palmer-Lab-UCSD/gview/internal/application"
)


func HomeHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		app.Log.PrintHttpRequest(r)
        template.ParseFiles(

        fmt.Fprintf(w, "Index")
		// if err = indexGet(w, r); err != nil {
		// 	app.Log.PrintError(err)
		// }
	}
}
