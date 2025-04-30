package api

import (
	"errors"
	"html/template"
	"net/http"

	"github.com/palmer-lab-ucsd/gview/internal/application"
	"github.com/palmer-lab-ucsd/gview/internal/service"
)

func gwasAnalysis(w http.ResponseWriter, db *service.OrgDb) error {
	var err error
	output := new(struct {
		Projects []string
	})

	output.Projects, err = service.GetProjectIds(db)
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

func GwasHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {

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
