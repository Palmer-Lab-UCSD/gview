package ui

import (
    "fmt"
    "path/filepath"
    "html/template"
)

func Home(tmplDir string) (*html.Template, error) {

    homeDir := filepath.Join(tmplDir, "home")

    return template.ParseFiles(filepath.Join(tmplDir,
            "base.html"), 
        filepath.Join(tmplDir, "footer.html"),
        filepath.Join(homeDir, "header.html"),
        filepath.Join(homeDir, "jsLinks.html"),
        filepath.Join(homeDir, "main.html"))

}

