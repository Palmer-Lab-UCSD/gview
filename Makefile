



main : cmd/gview/main.go internal/api/*.go internal/service/*.go internal/config/*
	go build -o main cmd/gview/main.go
