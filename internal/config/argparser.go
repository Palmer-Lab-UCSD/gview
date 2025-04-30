package config

import (
	"flag"
	"os"
	"path/filepath"
)

type Args struct {
	log_to_stdout  bool
	root		   string
	configFilename string
}

const DefaultRootEnvVar string = "GVIEW_ROOT"

func ParseInput() *Args {
	args := new(Args)

	flag.BoolVar(&(args.log_to_stdout), "c",
		false, "Print the log to standard out")

	flag.StringVar(&(args.root), "root",
		os.Getenv(DefaultRootEnvVar),
		"The root directory of the webservice")

	flag.StringVar(&(args.configFilename), "config",
		filepath.Join(os.Getenv(DefaultRootEnvVar),
			"internal", "config", "config.json"),
		"Server configuration file.")

	flag.Parse()

	return args
}
