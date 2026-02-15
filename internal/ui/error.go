package ui

import (
    "fmt"
    "net/http"
)

func ErrorHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "error\n")
}
