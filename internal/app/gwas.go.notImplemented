package app

import (
	"errors"
	"html/template"
	"net/http"

	"github.com/Palmer-Lab-UCSD/gview/internal/config"
	"github.com/Palmer-Lab-UCSD/gview/internal/dbs"
)

func gwasAnalysis(w http.ResponseWriter, db *dbs.DataDb) error {
	var err error
	output := new(struct {
		Projects []string
	})

	output.Projects, err = dbs.GetProjectIds(db)
	if err != nil {
		return err
	}

	var t *template.Template
	t, err = template.ParseFiles("public/templates/gwas.html")
	if err != nil {
		return err
	}

	return t.Execute(w, output)
}

func GwasHandlerFunc(app *app.App) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		app.Log.PrintHttpRequest(r)

		if r.Method != http.MethodGet {
			app.Log.PrintError(errors.New("resource does not exist"))
			return
		}

		if err = gwasAnalysis(w, app.Db); err != nil {
			app.Log.PrintError(err)
		}
	}
}
