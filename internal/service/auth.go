package service

import (
	"fmt"
)

type Authenticate struct {
	todo 		string
}

// TODO
func AuthenticatorInit() (*Authenticate, error) {
	fmt.Println("authorization disabled: not yet implemented")
	return &Authenticate{}, nil
}
