package ui

import (
    "fmt"
    "net/http"
    "html/template"
    "path/filepath"

    "github.com/Palmer-Lab-UCSD/gview/internal/app"
)


func SignInHandlerFunc(app *app.App) func(http.ResponseWriter, *http.Request) {

    tmplDir := app.Cfg.Ui.TemplatesDir
    signInDir := filepath.Join(tmplDir, "signIn")

    tmpl, err := template.ParseFiles(filepath.Join(tmplDir,
            "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(signInDir, "header.html"),
        filepath.Join(signInDir, "main.html"),
        filepath.Join(signInDir, "jsLinks.html"))

    if err != nil {
        panic("Error in parsing signIn template files.")
    }

    return func(w http.ResponseWriter, r *http.Request) {
        app.Log.PrintHttpRequest(r)

        if tmpl.Execute(w, nil) != nil {
            fmt.Printf("execute template error in signIn")
            http.Redirect(w, r, "/error", http.StatusInternalServerError)
        }
    }
}
