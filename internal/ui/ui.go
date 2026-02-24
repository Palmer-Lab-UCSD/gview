package ui

import (
    "fmt"
    "path/filepath"
    "html/template"
)

type GviewTemplate template.Template 

func InitTemplate(tmplDir string, tmplPage string) (*GviewTemplate, error) {
    var err error
    var tmpl GviewTemplate

    pageDir := filepath.Join(tmplDir, tmplPage)

    tmpl, err := template.ParseFiles(filepath.Join(tmplDir, "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(pageDir, "header.html"),
        filepath.Join(pageDir, "jsLinks.html"),
        filepath.Join(pageDir, "main.html"))
    if err != nil {
        return nil, err
    }
    
    return &tmpl, nil
}

