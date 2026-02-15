package config

import (
	"encoding/json"
	"io"
	"os"
)

type Network struct {
	HostName    string
	Port        string
    Certs       string
}

type AuthConfig struct {
    Pepper          string
    BcryptHashCost  string
}

type ApiConfig struct {
    MaxGenomicCoordDomain   uint64
}

type UiConfig struct {
    StaticDir       string
	TemplatesDir    string
}

type LogConfig struct {
	Dir         string
	MaxFileSize int64
}

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


type Config struct {
    ConfigName  string
    Network     *NetworkConfig
    Auth        *AuthConfig
	Api         *ApiConfig
    Ui          *UiConfig
	Log         *LogConfig
	Db          *DatabaseConfig
}

func NewCfg() *Config {
    return &Config{ConfigName: "",
        Ui: new(UiConfig),
        Network: new(NetworkConfig),
        Auth: new(AuthConfig),
        Api: new(ApiConfig),
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
	
	if args.log_to_stdout {
		cfg.Log.Dir = ""
	}

	return cfg, nil
}
