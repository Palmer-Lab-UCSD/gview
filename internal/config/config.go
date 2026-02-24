package config

import (
	"encoding/json"
	"io"
	"os"
)

type NetworkConfig struct {
	HostName            string
	Port                string
    Certs               string
    ReadTimeout         uint8
    ReadHeaderTimeout   uint8
    WriteTimeout        uint8
    IdleTimeout         uint8
}

type AuthConfig struct {
    Pepper          string
    BcryptHashCost  uint8
}

type LocusZoomConfig struct {
    MaxGenomicCoordDomain   uint64
}

type VisConfig struct {
    LocusZoom       *LocusZoomConfig
}


type UiConfig struct {
    StaticDir       string
	TemplatesDir    string
}

type LogConfig struct {
	Dir         string
	MaxFileSize int64
}

type DatabaseNetwork struct {
	Driver            string
	HostName          string
	Port              string
	SslMode           string
	SslCert           string
	SslKey            string
	SslRootCert       string
	ConnectionTimeOut string
}

type DatabaseConfig struct {
    Name                string
    UserEnvVar          string
    PasswdEnvVar        string
    NetworkSettings     *DatabaseNetwork
}


type Config struct {
    ConfigName  string
    Network     *NetworkConfig
    Auth        *AuthConfig
	Vis         *VisConfig
    Ui          *UiConfig
	Log         *LogConfig
	Db          map[string]*DatabaseConfig
}

func NewCfg() *Config {
    return &Config{ConfigName: "",
        Ui:         new(UiConfig),
        Network:    new(NetworkConfig),
        Auth:       new(AuthConfig),
        Vis:        new(VisConfig),
		Log:        new(LogConfig),
        Db:         make(map[string]*DatabaseConfig)}
}        

func readConfig(filename string, cfg *Config) error {
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

func InitConfig(logsToStdout bool, configFilename string) (*Config, error) {

	var cfg *Config = NewCfg()
	var err error

	if err = readConfig(configFilename, cfg); err != nil {
		return nil, err
	}
	
	if logsToStdout {
		cfg.Log.Dir = ""
	}

	return cfg, nil
}
