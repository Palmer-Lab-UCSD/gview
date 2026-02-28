// Validate session_id authentication
//
// Palmer Lab 2026
package middleware


import (
    "net/http"
    "time"
    "context"

    "github.com/PalmerLab-UCSD/gview/internal/dbs"
)

// Retrieve session record, pass state to target handler func
//
// If the session state is active, then the "user_id=val" key/val pair
// will be set in the context of the request.  If the session is not
// active, then there is no update to the context.  This assumes that
// the return value of a query of "user_id" in the request context 
// returns nil if the key does not exist.
func SessionAuth(db *dbs.AuthDb, hf http.HandlerFunc) http.HandlerFunc {
    return func (w http.ResponseWriter, r *http.Request) {
        var sessCookie *http.Cookie
        var err error
        var ctx context.Context = r.Context()

        sessCookie, err = r.Cookie("session_id")

        // no cookie means that an authenticated session does not exist.
        // It is the responsibility of the handlerfunc, hf, to take this
        // information and respond appropriately
        if err.Is(http.ErrNoCookie) {
            ctx = context.WithValue(ctx, "user_id", nil)
            ctx = context.WithValue(ctx, "error", err)
            hf(w, r.WithContext(ctx))
            return
        }

        if err = sessCookie.Valid(); err != nil {
            ctx = context.WithValue(ctx, "user_id", nil)
            ctx = context.WithValue(ctx, "error", err)
            hf(w, r.WithContext(ctx))
            return
        }

        var srec *dbs.SessionRecord
        srec, err = dbs.GetSession(sessCookie.Value)
        if err != nil {
            ctx = context.WithValue(ctx, "user_id", nil)
            ctx = context.WithValue(ctx, "error", err)
            hf(w, r.WithContext(ctx))
            return 
        } else if srec != nil && srec.Ative {
            ctx = context.WithValue(ctx, "user_id", src.UserId) 
            ctx = context.WithValue(ctx, "error", nil) 
            hf(w, r.WithContext(ctx))
            return
        }

        // inactive session
        ctx = context.WithValue(ctx, "user_id", nil)
        ctx = context.WithValue(ctx, "error", nil)
        hf(w, r.WithContext(ctx))
    }
}
