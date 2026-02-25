package api

import (
    "encoding/json"
    "net/http"
    "net/mail"
    "golang.org/x/crypto/bcrypt"

    // "github.com/Palmer-Lab-UCSD/internal/dbs"
)


type ResponseSignIn struct {
    requestUrl  string
}


func isValidEmail(email string) bool {
    return false
}


func decomposeEmail(emailAddressStr string) {
    address, err := mail.ParseAddress(emailAddressStr)

}


// Verify user sign in credentials.
// Sign in credentials are stored in a form and submitted using the
// fetch API
//
// A response should:
//  * Discloses the validity of user credentials through http status
//      codes.  Status code of 200 indicates match, 
func verifySignInFunc(api *AuthApi) func(http.ResponseWriter, *http.Request) {
    
    // I think declaring variables once, would cause a race condition,
    // as they would be shared accross all threads.  Need to double 
    // check
    // var res ResponseSignIn
    // var cookie *http.Cookie

    return func (w http.ResponseWriter, r *http.Request) {

        // A user is logged in if they have an active session_id
        // cookie, otherwise user is needs to sign in
        var res ResponseSignIn
        var cookie *http.Cookie
        var err error
        var isSignedIn bool

        cookie, err = r.Cookie("session_id")
        if err != http.ErrNoCookie {
            // TODO: check session id return to workspace
            isSignedIn, err = api.Db.IsSessionActive(userID, )
            if err 
        }

        api.Log.PrintHttpRequest(r)

	    w.Header().Add("content-type", "application/json")
        
        if err := r.ParseForm(); err != nil {
            api.Log.PrintError(err)
            w.WriteHeader(http.StatusBadRequest)
            res = ResponseSignIn{redirectUrl:""}
            outjson, _ := json.Marshal(res)
            w.Write(outjson)
            return
        }

        // Authenticate
        if isValidCred(r) {
            w.WriteHeader(http.StatusOK)
            // TODO NEED TO SUBSTITUTE USER ID
            res = ResponseSignIn("/workspace/user id")

            // TODO NEED TO SET COOOKIES
            
            outjson, _ := json.Marshal(res)
            w.Write(outjson)
        } else {
            w.WriteHeader(http.BadRequest)
            res = ResponseSignIn{redirectUrl: ""}
            outjson, _ := json.Marshal(res)
            w.Write(outjson)
        }


        // Package response

    }
}

func sessionFunc(api *Api) func(w http.ResponseWriter, r *http.Request) {

    return func(w http.ResponseWriter, r *http.Request) {
        
    }
}
