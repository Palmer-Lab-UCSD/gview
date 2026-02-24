package ui

import (
    "fmt"
    "io"
    "path/filepath"
    "html/template"
)


type ErrorPageRec struct {
    StatusCode      int
    Title           string
    Msg             string
}


func InitErrorPageTemplate(tmplDir string) (*html.Template, error) {

    errorDir := filepath.Join(tmplDir, "error")

    tmpl, err := template.ParseFiles(filepath.Join(tmplDir, "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(errorDir, "header.html"),
        filepath.Join(errorDir, "jsLinks.html"),
        filepath.Join(errorDir, "main.html"))
    if err != nil {
        return nil, err
    }
    
    return tmpl, nil
}

