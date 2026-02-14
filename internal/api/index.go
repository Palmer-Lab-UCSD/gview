package api

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Palmer-Lab-UCSD/gview/internal/application"
	"github.com/Palmer-Lab-UCSD/gview/internal/service"
)


func IndexHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		app.Log.PrintHttpRequest(r)

		if err = indexGet(w, r); err != nil {
			app.Log.PrintError(err)
		}
	}
}
