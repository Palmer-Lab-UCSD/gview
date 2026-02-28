package app

import (
    "errors"
    "net/http"
    "html/template"

    "github.com/Palmer-Lab-UCSD/gview/internal/ui"
)


type ErrInfo struct {
    Code    int
    Title   string
    Msg     string
}


func makeHomePageFunc(appd *App) http.HandlerFunc {
    var tmpl *template.Template
    var err error

    tmpl, err = ui.InitTemplate(appd.Cfg.Ui.TemplatesDir, "home")

    if err != nil {
        appd.Log.Fatalln(err)
    }

    return func(w http.ResponseWriter, r *http.Request) {
		appd.Log.PrintHttpRequest(r)

        if tmpl.Execute(w, nil) != nil {
            appd.Log.PrintError(errors.New("execute home template failure"))

            var errInfo ErrInfo = ErrInfo{Code: http.StatusInternalServerError,
                Title: http.StatusText(http.StatusInternalServerError),
                Msg: "Sorry, problem on our end, please contact maintainer."}

            w.WriteHeader(errInfo.Code)

            appd.ErrTmpl.Execute(w, errInfo)
        }
    }
}


func makeSignInPageFunc(appd *App) func(http.ResponseWriter, *http.Request) {

    tmpl, err := ui.InitTemplate(appd.Cfg.Ui.TemplatesDir, "signIn")

    if tmpl != nil {
        appd.Log.Fatalln(err)
    }

    return func(w http.ResponseWriter, r *http.Request) {
		appd.Log.PrintHttpRequest(r)

        if tmpl.Execute(w, nil) != nil {
            appd.Log.PrintError(errors.New("execute sign in template failure"))

            var errInfo ErrInfo = ErrInfo{Code: http.StatusInternalServerError,
                Title: http.StatusText(http.StatusInternalServerError),
                Msg: "Sorry, problem on our end, please contact maintainer."}

            w.WriteHeader(errInfo.Code)

            appd.ErrTmpl.Execute(w, errInfo)
        }
    }
}


func makeWorkspacePageFunc(appd *App) func(http.ResponseWriter, *http.Request) {
    return func(w http.ResponseWriter, r *http.Request) {
        appd.Log.PrintError(errors.New("execute workspace template failure"))

        var errInfo ErrInfo = ErrInfo{Code: http.StatusInternalServerError,
            Title: http.StatusText(http.StatusInternalServerError),
            Msg: "Note implemented"}

        w.WriteHeader(errInfo.Code)

        appd.ErrTmpl.Execute(w, errInfo)
    }
}
