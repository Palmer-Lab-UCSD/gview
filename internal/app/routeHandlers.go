package app

import (
    "fmt"
    "net/http"

    "github.com/Palmer-Lab-UCSD/gview/internal/ui"
)


type ErrInfo {
    Code    int
    Title   string
    Msg     string
}


func makeHomePageFunc(appd *App) HandleFunc {
    var tmpl *ui.GviewTemplate 
    var err error

    tmpl, err = ui.InitTemplate(appd.Cfg.Ui.TemplatesDir, tmplPage)

    if err != nil {
        appd.Log.Fatalln(err)
    }

    return func(w http.ResponseWriter, *r http.Request) {
		appd.Log.PrintHttpRequest(r)
        var header *http.Header = w.Header()

        if tmpl.Execute(w, nil) != nil {
            appd.Log.PrintError("execute home template failure")

            var errInfo ErrInfo{Code: http.StatusInternalServerError,
                Title: http.StatusText(http.StatusInternalServerError),
                Msg: "Sorry, problem on our end, please contact maintainer."}

            w.WriteHeader(errInfo.Code)

            appd.ErrTmpl.Execute(w, errInfo)
        }
    }
}


func makeSignInPageFunc(appd *App) HandleFunc {

    tmpl, err := ui.InitTemplate(appd.Cfg.Ui.TemplatesDir, "signIn")

    if tmpl != nil {
        appd.Log.Fatalln(err)
    }

    return func(w http.ResponseWriter, *r http.Request) {
		appd.Log.PrintHttpRequest(r)

        if tmpl.Execute(w, nil) != nil {
            appd.Log.PrintError("execute sign in template failure")

            var errInfo ErrInfo{Code: http.StatusInternalServerError,
                Title: http.StatusText(http.StatusInternalServerError),
                Msg: "Sorry, problem on our end, please contact maintainer."}

            w.WriteHeader(errInfo.Code)

            appd.ErrTmpl.Execute(w, errInfo)
        }
    }
}


func makeWorkspacePageFunc(appd *App) HandleFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        appd.Log.PrintError("execute workspace template failure")

        var errInfo ErrInfo{Code: http.StatusInternalServerError,
            Title: http.StatusText(http.StatusInternalServerError),
            Msg: "Note implemented"error}

        w.WriteHeader(errInfo.Code)

        appd.ErrTmpl.Execute(w, errInfo)
    }
}
