package dbs

import (
	"database/sql"
    "errors"
    "time"
	"os"

	_ "github.com/lib/pq"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)


// one week
const (
    MAX_OPEN_SESSION
    MAX_INACTIVITY
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
    Duration        float32
    Active          bool
}


type AuthDb stuct {
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
    var rec SessionRecord

    err = db.QueryRow(`SELECT last_activity, duration, active 
    FROM sessions 
    WHERE user_id = $1 AND session_id = $2;
    `, 
    userId, sessionId).Scan(&rec.LastActivity,
                            &rec.Duration,
                            &rec.Active)
    if err == sql.ErrNoRows || !rec.Active {
        return false
    }

    // need current date timed. Duration += CurrentTime - Last actvity
    var currentTime time.Time = time.Now()
    inactiveTime = asdfasdfsda
    rec.Duration += inactiveTime
    if rec.Duration >= MAX_OPEN_SESSION || inactiveTime >= MAX_INACTIVITY {
        rec.Active = false
        return false
    }

    rec.LastActivity = currentTime

}

