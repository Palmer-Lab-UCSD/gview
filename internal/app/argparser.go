// Set and parse command line options
//
// ARGS
// -c   print log to server standard out
// --config path to server configuration file
//
package app

import (
	"flag"
	"os"
	"path/filepath"
)

type Args struct {
	log_to_stdout  bool
	configFilename string
}

const DEFAULT_ROOT= "."


func parseInputArgs() *Args {
	args := new(Args)

	flag.BoolVar(&(args.log_to_stdout), "c", false,
		"Print the log to standard out")

    defaultConfig := filepath.Join(DEFAULT_ROOT, "internal", "config",
			"dev.json")

	flag.StringVar(&(args.configFilename), "config", defaultConfig,
		"Path and name of server configuration file.")

	flag.Parse()

	return args
}
