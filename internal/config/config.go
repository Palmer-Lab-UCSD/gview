package config

import (
	"encoding/json"
	"io"
	"os"
)

type DatabaseConfig struct {
	UserEnvVar        string
	PasswdEnvVar      string
	Name              string
	Driver            string
	HostName          string
	Port              string
	SslMode           string
	SslCert           string
	SslKey            string
	SslRootCert       string
	ConnectionTimeOut string
}

type LogConfig struct {
	Dir         string
	MaxFileSize int64
}

type ApiConfig struct {
	MaxGenomicCoordDomain uint
	Js                    string
	Css                   string
	Templates             string
}

type Config struct {
	RootDir  string
	HostName string
	Port     string
	Api      *ApiConfig
	Log      *LogConfig
	Db       *DatabaseConfig
}

func NewCfg() *Config {
	return &Config{Api: new(ApiConfig),
		Log: new(LogConfig),
		Db:  new(DatabaseConfig)}
}

func ReadConfig(filename string, cfg *Config) error {

	fid, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer fid.Close()

	var body []byte
	if body, err = io.ReadAll(fid); err != nil {
		return err
	}

	if err = json.Unmarshal(body, cfg); err != nil {
		return err
	}

	return nil
}

func InitConfig(args *Args) (*Config, error) {

	cfg := NewCfg()
	var err error

	if err = ReadConfig(args.configFilename, cfg); err != nil {
		return nil, err
	}
	
	if cfg.RootDir == "" {
		cfg.RootDir = args.root
	}

	if args.log_to_stdout {
		cfg.Log.Dir = ""
	}

	return cfg, nil
}
