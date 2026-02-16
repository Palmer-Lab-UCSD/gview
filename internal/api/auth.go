package api

    // "github.com/Palmer-Lab-UCSD/internal/service"
import (
    "encoding/json"
    "net/http"

    "github.com/Palmer-Lab-UCSD/gview/internal/app"
)


type AuthResponse struct {
    ErrMsg          string
    RedirectUrl     string
}


func AuthHandlerFunc(app *app.App) func(http.ResponseWriter, *http.Request) {
    
    return func (w http.ResponseWriter, r *http.Request) {
        app.Log.PrintHttpRequest(r)

	    w.Header().Add("content-type", "application/json")
        
        if err := r.ParseForm(); err != nil {
            app.Log.PrintError(err)
            w.WriteHeader(http.StatusInternalServerError)
            outjson, _ := json.Marshal(AuthResponse{
                ErrMsg: "Parse sign-in credentials.",
                RedirectUrl: ""})
            _, _ = w.Write(outjson)
            return
        }

        // Authenticate

        // Package response
        outjson, err := json.Marshal(AuthResponse{ErrMsg: "",
            RedirectUrl: "/workspace/1"})

        if err != nil {
            app.Log.PrintError(err)
            w.WriteHeader(http.StatusInternalServerError)
            outjson, _ := json.Marshal(AuthResponse{
                ErrMsg: "Parse sign-in credentials.",
                RedirectUrl: ""})
            _, _ = w.Write(outjson)
            return
        }

        w.WriteHeader(http.StatusOK)
        _, _ = w.Write(outjson)
    }
}


