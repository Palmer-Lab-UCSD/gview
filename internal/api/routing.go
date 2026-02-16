package api

import (
	"fmt"
	"net/http"
	"os"

    "github.com/Palmer-Lab-UCSD/gview/internal/"
)


	mux.HandleFunc("POST /api/auth", api.AuthHandlerFunc(app))
