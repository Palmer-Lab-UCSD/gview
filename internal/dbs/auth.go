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
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)


type Date time.Time

type UserRecord struct {
    UserId      string
    Email       string
    Pw          string
    PwExpiry    Date
    Verified    bool
}


type SessionRecord struct {
    UserId          string
    SessionId       string
    LastActivity    Date 
    InactiveExpiry  Date
    SessionExpiry   Date
    Active          bool
}


type AuthDb struct {
    *sql.DB
}

// RETURN
// nil, nil means there is no record found
func (db *AuthDb) GetUserFromEmail(email, string) (*UserRecord, error) {
    
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


func(db *AuthDb) IsSessionActive(useId string, sessionId string) bool {
    var err error
    var rec SessionValidateRec

    err = db.QueryRow(`SELECT 
    FROM sessions 
    WHERE user_id = $1 AND session_id = $2;
    `, userId, sessionId).Scan(&rec.UserId,
        &rec.SessionId,
        &rec.LastActivity,
        &rec.InactiveExpiry,
        &rec.SessionExpiry,
        &rec.Active)
    if err == sql.ErrNoRows || !rec.Active {
        return false
    }

    // ASSUMPTION: from this point forward, rec.Active in the
    // database is assumed true

    //TODO: I need to update the database when active to inactive state
    // need current date timed. Duration += CurrentTime - Last actvity
    var currentTime time.Time = time.Now()
    if currentTime > rec.InactiveExpiry 
        || currentTime > rec.SessionExpiry {
        
        rec.Active = false
    } 

    var delta Date = currentTime - rec.InactiveExpiry
    // When confined to a single time zone 
    if delta < 0 {
        rec.Active = false
    }

    // Update the database because session has been deactivated
    if !rec.Active {
        adfa
    }

    // Updating the database InactiveExpiry column for every
    // database transaction seems too expensive.  I am going to
    // update after a UpdateTimeCriterion amount of time
    if delta > UpdateInactiveExpiryTimeCriterion {
        rec.InactiveExpiry = currentTime + MaxInactiveTime 
    }


}

