package ui

import (
    "fmt"
    "net/http"
    "html/template"
    "path/filepath"

    "github.com/Palmer-Lab-UCSD/gview/internal/config"
    "github.com/Palmer-Lab-UCSD/gview/internal/logger"
)


func SignInPage(tmplDir string) (*tmpl.Template, error) {

    signInDir := filepath.Join(tmplDir, "signIn")

    tmpl, err := template.ParseFiles(filepath.Join(tmplDir, "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(signInDir, "header.html"),
        filepath.Join(signInDir, "main.html"),
        filepath.Join(signInDir, "jsLinks.html"))

    if err != nil {
        return nil, err
    }

    return tmpl, nil
}
