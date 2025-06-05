package service

import (
    "errors"
    "crypto/rand"
    "fmt"
)


const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const N_ALPHABET = len(ALPHABET)

func RandString(n uint8) (string, error) {
    if n == 0 {
        return "", errors.New("RandString requires n >= 1")
    }

    s := make([]byte, n)

    if _, err := rand.Read(s); err != nil {
        fmt.Println(err)
        return "", err
    }

    for i := uint8(0); i < n; i++ {
        s[i] = ALPHABET[int(s[i]) % N_ALPHABET]
    }
    
    return string(s), nil
}
