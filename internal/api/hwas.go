package api

import (
	"fmt"
	"net/http"
	"github.com/palmer-lab-ucsd/gview/internal/application"
)

// TODO
func hwasText(w http.ResponseWriter, r *http.Request) error {
	fmt.Fprintf(w, "%s HWAS not implemented", r.Method)
	return nil
}

func HwasHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		app.Log.PrintHttpRequest(r)

		if err = hwasText(w, r); err != nil {
			app.Log.PrintError(err)
		}
	}
}
