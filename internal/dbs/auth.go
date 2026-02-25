// Database records for user session management
// 
// Assumptions:
//  * All times recorded as UTC, so that I don't have time-zone
//      issues.
//
package dbs

import (
	"database/sql"
    "errors"
    "time"
    "crypto/sha512"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)


const (
   NANOSECONDS_PER_SECOND = 1000000000 
)


type UserRecord struct {
    UserId      string
    Email       string
    Pw          string
    PwExpiry    time.Time
    Verified    bool
}


type SessionRecord struct {
    UserId          string
    SessionId       string
    LastActive      time.Time
    InactiveExpiry  time.Time
    SessionExpiry   time.Time
    Active          bool
}


// Note that all int64 times need to be in nanoseconds
type AuthDb struct {
    sql.DB
    config.AuthConfig
}

// RETURN
// nil, nil means there is no record found
func (db *AuthDb) GetUserFromEmail(email string) (*UserRecord, error) {
    
    var err error
    var rec UserRecord

    err = db.QueryRow("SELECT * FROM users WHERE email = $1",
        email).Scan(&rec.UserId, 
                    &rec.Email, 
                    &rec.Pw,
                    &rec.PwExpiry,
                    &rec.Verified)

    // err indicates no record found
    if err == sql.ErrNoRows {
        return nil, nil
    } else if err != nil {// A true error
        return nil, err
    }

    return &rec, nil
}


func (db *AuthDb) IsValidSignIn(email string, pw string) (bool, error) {
    err = bcrypt.CompareHashAndPassword(hashPw, []byte(pepperedPassword))
    if err == nil {
        return true
    }
}


// Checks whether session is active and updates database accordingly
//
// If current session is active and the current time is less than
// the session expiry and inactivity expiry then evaluate to true,
// else false.  This is important, cases that I don't account for
// will default to false.
func(db *AuthDb) IsSessionActive(userId string, sessionId string) (bool, error) {
    var err error
    var rec SessionRecord
    var res sql.Result

    // Note: sha256.Size is 32 
    // Note: sha512.Size is 64
    var shaSumSessionId [sha512.Size]byte = sha512.Sum512([]byte(sessionId))

    err = db.QueryRow(`SELECT 
    FROM sessions 
    WHERE user_id = $1 AND session_id = $2;
    `, userId, shaSumSessionId).Scan(&rec.UserId,
        &rec.SessionId,
        &rec.LastActive,
        &rec.InactiveExpiry,
        &rec.SessionExpiry,
        &rec.Active)
    if err == sql.ErrNoRows || !rec.Active {
        return false, nil
    }

    // ASSUMPTION: from this point forward, rec.Active in the
    // database is assumed true

    // Handle case when session is not expired
    var now time.Time = time.Now()
    if now.Before(rec.InactiveExpiry) && now.Before(rec.SessionExpiry) {

        // Updating the database InactiveExpiry column for every
        // database transaction seems too expensive.  I am going to
        // update after a UpdateTimeCriterion amount of time
        if now.Sub(rec.InactiveExpiry) > db.MinTimeUpdateDbActivity {

            rec.InactiveExpiry = now.Add(db.MaxTimeInactive)
            // TODO: Update db
            // TODO: Consider submitting database update concurrently
            //      using goroutine

            db.Exec(`UPDATE sessions SET last_active = $1
            WHERE user_id = $2 AND session_id = $3;`, now, userId, shaSumSessionId)

            if err != nil {
                return false, err
            } else if rows, err := res.RowsAffected(); rows != 1 || err != nil {
                return false, errors.New("Matched more than one row")
            }
        }

        return true, nil
    } 

    // Handle all other cases, I assume that they indicate session 
    // has expired. Consequently, active being true in the database
    // needs to be updated to false
    // TODO: Consider submitting database update concurrently
    //      using goroutine
    res, err = db.Exec(`UPDATE sessions SET active = false
    WHERE user_id = $1 AND session_id = $2;`, userId, shaSumSessionId)

    return false, nil
}


func OpenAuthDbConn(dbCfg *config.DatabaseConfig, 
    authCfg config.AuthConfig) (*AuthDb, error) {

    var dbptr *sql.DB

    if err := OpenDbConn(dbptr, dbCfg); err != nil {
        return nil, err
    }

    // need to convert time in seconds to nanoseconds so that I can use
    // golang time package for computing time differences
    authCfg.MaxTimeInactive = authCfg.MaxTimeInactive / NANOSECONDS_PER_SECOND
    authCfg.MaxTimeSessionOpen = authCfg.MaxTimeSessionOpen / NANOSECONDS_PER_SECOND
    authCfg.MinTimeUpdateDbActivity = authCfg.MaxTimeSessionOpen / NANOSECONDS_PER_SECOND

    return &AuthDb{*dbptr, authCfg}, nil
}

