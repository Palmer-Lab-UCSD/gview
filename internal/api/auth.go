package api

import (
    "encoding/json"
    "net/http"
    "net/mail"
    "golang.org/x/crypto/bcrypt"

    "github.com/Palmer-Lab-UCSD/internal/dbs"
)

type ResponseSignIn {
    requestUrl  string
}


func isValidSignIn(email string, password string) bool {
    emailAddress, err := mail.ParseAddress(email)
    if err != nil {
        return false
    }
    
    hashPw     

    err = bcrypt.CompareHashAndPassword(hashPw, []byte(pepperedPassword))
    if err == nil {
        return true
    }

    return fail
}


// Verify user sign in credentials.
//
// A response should:
//  * Discloses the validity of user credentials through http status
//      codes.  Status code of 200 indicates match, 
func signInFunc(api *Api) func(http.ResponseWriter, *http.Request) {
    
    var res ResponseSignIn

    return func (w http.ResponseWriter, r *http.Request) {
        //TODO CHECK IF USER IS ALREADY LOGGED IN


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


