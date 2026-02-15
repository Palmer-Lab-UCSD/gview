package ui

import (
    "fmt"
    "path/filepath"
    "net/http"
    "html/template"

    "github.com/Palmer-Lab-UCSD/gview/internal/app"
)


func HomeHandlerFunc(app *app.App) func(http.ResponseWriter, *http.Request) {

    tmplDir := app.Cfg.Ui.TemplatesDir
    homeDir := filepath.Join(tmplDir, "home")


    fmt.Printf("Template dir: %s\n", tmplDir)
    fmt.Printf("Home dir: %s\n", homeDir)
	return func(w http.ResponseWriter, r *http.Request) {

		app.Log.PrintHttpRequest(r)

        tmpl, err := template.ParseFiles(filepath.Join(tmplDir,
                "base.html"), 
            filepath.Join(tmplDir, "header.html"),
            filepath.Join(tmplDir, "footer.html"),
            filepath.Join(homeDir, "main.html"))

        if err != nil {
            fmt.Printf("how did I get here?\n")
            http.Redirect(w, r, "/error", 
                http.StatusInternalServerError)
        }

            
        if tmpl.Execute(w, nil)  != nil {
            fmt.Printf("execute template failure")
            http.Redirect(w, r, "/error", 
                http.StatusInternalServerError)
        }
		// if err = indexGet(w, r); err != nil {
		// 	app.Log.PrintError(err)
		// }
	}
}
