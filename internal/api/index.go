package api

import (
	"fmt"
	"net/http"
	"os"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/oauth2"

	"gview/internal/application"
	"gview/internal/service"
)


const N_BYTES_UNIQ_STR = 64

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


	    url := Oauth2Config.AuthCodeURL(service.RandString(N_BYTES_UNIQ_STR),
            oauth2.AccessTypeOffline)

	    http.Redirect(writer, request, url, http.StatusFound)


		if err = indexGet(w, r); err != nil {
			app.Log.PrintError(err)
		}
	}
}
