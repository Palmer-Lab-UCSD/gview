package service

import (
	"context"
	"github.com/coreos/go-oidc"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/oauth2"
    "crypto/rand"
	"log"
	"os"
)



type ClaimsPage struct {
	AccessToken string
	Claims      jwt.MapClaims
}


var (
	clientID     string = os.Getenv("AWS_COGNITO_CLIENT_ID")
	clientSecret string = "<client secret>"
	redirectURL  string = "https://gview.ratgenes.org/user"
	issuerURL    string = os.Getenv("AWS_COGNITO_ISSUER_URL")
	provider     *oidc.Provider
	Oauth2Config oauth2.Config
)

func init() {
	var err error
	// Validate clientId and issuerURL
	if clientID == "" {
		log.Fatalf("clientID not found")
	} else if issuerURL == "" {
		log.Fatalf("issuerURL not found")
	}

	// Initialize OIDC provider
	provider, err = oidc.NewProvider(context.Background(), issuerURL)
	if err != nil {
		log.Fatalf("Failed to create OIDC provider: %v", err)
	}

	// Set up OAuth2 config
	Oauth2Config = oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Endpoint:     provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID, "phone", "openid", "email"},
	}
}
