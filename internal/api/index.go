package api

import (
	"fmt"
	"net/http"
	"os"
	"github.com/palmer-lab-ucsd/gview/internal/application"
)

func indexGet(w http.ResponseWriter, r *http.Request) error {
	body, err := os.ReadFile("public/index.html")

	if err != nil {
		fmt.Printf("Error\n")
	}

	w.Write(body)
	return nil
}

func IndexHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		app.Log.PrintHttpRequest(r)

		if r.Method != http.MethodGet {
			http.Error(w,
				fmt.Sprintf("%s: %s is not supported.",
					r.Method,
					r.URL.Path),
				http.StatusBadRequest)
		}

		if err = indexGet(w, r); err != nil {
			app.Log.PrintError(err)
		}
	}
}
