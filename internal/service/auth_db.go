package service

import (
    "net/mail"
    "crypto/rand"
    "time"
    "golang.org/x/crypto/bcrypt"
	"os"

	_ "github.com/lib/pq"
)

type Date time.Time

type UsersTable struct {
    UserId      string
    Email       string
    Pw          string
    PwExpiry    Date
    Verified    bool
}

type SessionTable struct {
    UserId          string
    SessionId       string
    LastActivity    Date 
    Duration        float32
    Active          bool
}


type AuthDb stuct {
    *sql.DB
}


func OpenAuthDbConn() {

}
