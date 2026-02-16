package app

import (
    "net/http"
    "github.com/Palmer-Lab-UCSD/gview/internal/ui"
)


func makeHomeFunc(app *App) func(http.ResponseWriter, http.Request) {
    
    if tmpl, err := ui.Home(app.Cfg.Ui.TemplatesDir); err != nil {
        panic("Error in parsing home template files.")
    }

    return func(w http.ResponseWriter, *r http.Request) {
		app.Log.PrintHttpRequest(r)

        if tmpl.Execute(w, nil)  != nil {
            fmt.Printf("execute template failure")
            http.Redirect(w, r, "/error", 
                http.StatusInternalServerError)
        }
    }
}


func makeSignInunc(app *App) func(http.ResponseWriter, http.Request) {

    return func(w http.ResponseWriter, *r http.Request) {

    }
}


func makeErrorFunc(app *App) func(http.ResponseWriter, http.Request) {

    return func(w http.ResponseWriter, *r http.Request) {

    }
}
