package ui

import (
    "path/filepath"
    "html/template"
)

func InitTemplate(tmplDir string, tmplPage string) (*template.Template, error) {
    var err error
    var tmpl *template.Template

    pageDir := filepath.Join(tmplDir, tmplPage)

    tmpl, err = template.ParseFiles(filepath.Join(tmplDir, "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(pageDir, "header.html"),
        filepath.Join(pageDir, "jsLinks.html"),
        filepath.Join(pageDir, "main.html"))
    if err != nil {
        return nil, err
    }
    
    return tmpl, nil
}

