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
    SessionId       []byte
    LastActive      time.Time
    InactiveExpiry  time.Time
    SessionExpiry   time.Time
    Active          bool
}

func newSessRecord() *SessionRecord {
    var sessRec *SessionRecord = new(SessionRecord)
    sessRec.SessionId = make([]byte, sha512.Size)

    return sessRec
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


// Get a session record from the database
//
// Given a session id from the client, find the associated session
// record.  If the session has expired, but its active field is set
// to true, update the record so that active is false.
//
// ARGUMENTS
//  clientSessionId: the session id provided by the client in a cookie
//
// RETURNS
//  *SessionRecord: If no valid record with the client provided session
//      exists, then return nil, ortherwise return a pointer to the 
//      record. 
//  err: the err indicates that the query failed or that the requirements
//      were not met, for example more than one record was updated to
//      the database, which should never happen. 
func(db *AuthDb) GetSession(clientSessId string) (*SessionRecord, error) {
    var err error
    var rec *SessionRecord = newSessRecord()
    var res sql.Result

    // Note: sha512.Size is 64
    var shaSumSessionId [sha512.Size]byte = sha512.Sum512([]byte(clientSessId))

    err = db.QueryRow(`SELECT 
    FROM sessions 
    WHERE session_id = $1;`, shaSumSessionId).Scan(&rec.UserId,
        &rec.SessionId,
        &rec.LastActive,
        &rec.InactiveExpiry,
        &rec.SessionExpiry,
        &rec.Active)
    if err == sql.ErrNoRows {
        return nil, nil
    } else if err != nil {
        return nil, err
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

            db.Exec(`UPDATE sessions SET last_active = $1
            WHERE session_id = $2;`, now, shaSumSessionId)

            if err != nil {
                return nil, err
            } else if rows, err := res.RowsAffected(); err != nil {
                return nil, err
            } else if rows != 1 {
                return nil, errors.New("Updated more than one row, when one was expected")
            }
        }

        return rec, nil
    }

    // Handle all other cases, I assume that they indicate session 
    // has expired. Consequently, active being true in the database
    // needs to be updated to false
    // TODO: Consider submitting database update concurrently
    //      using goroutine
    res, err = db.Exec(`UPDATE sessions SET active = false
    WHERE session_id = $1;`, shaSumSessionId)
    if rows, err := res.RowsAffected(); err != nil {
        return nil, err
    } else if rows != 1 {
        return nil, errors.New("Updated more than one row, when one was expected")
    }

    return nil, nil
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

