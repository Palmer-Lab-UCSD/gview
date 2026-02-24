package logger

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"path/filepath"
	"github.com/Palmer-Lab-UCSD/gview/internal/config"
)

type AppLogger struct {
	log.Logger
}

func (l *AppLogger) PrintHttpRequest(r *http.Request) {
	l.Printf("HTTP %s %s %s %s\n",
		r.Method,
		r.URL.Path,
		r.Header.Get("Host"),
		r.Header.Get("User-Agent"))
}

func (l *AppLogger) PrintError(err error) {
	l.Printf("ERROR %s\n", err.Error())
}

// only store 1000 log files
func filenameIndex(i int) string {
	return fmt.Sprintf("%03d", i%1000)
}

func getFilesize(filename string) int64 {
	fid, err := os.Open(filename)
	if os.IsNotExist(err) {
		return 0
	}
    defer fid.Close()

	if err != nil {
		return -1
	}

	finfo, err := fid.Stat()
	if err != nil {
		return -1
	}

	return finfo.Size()
}

func getLogFilename(dir string, max_filesize int64) string {
	var prev_name string
	var fsize int64

	out_name := filepath.Join(dir, filenameIndex(1))
	prev_name = out_name

	fsize = getFilesize(out_name)
	for i := 0; fsize >= max_filesize; i++ {
		prev_name = out_name
		out_name = filepath.Join(dir, filenameIndex(1))
		fsize = getFilesize(out_name)
	}

	if fsize < 0 {
		return ""
	}

	return prev_name
}


func InitLogger(cfg *config.LogConfig) (*AppLogger, error) {

    var logger *AppLogger = new(AppLogger)

	if cfg.Dir == "" {
		logger.SetOutput(os.Stdout)
		logger.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
		return logger, nil
	}

    // Note: what is being returned is the empty AppLogger struct
	out_name := getLogFilename(cfg.Dir, cfg.MaxFileSize)
	if out_name == "" {
		return nil, errors.New("Failed to find log filename")
	}

	fid, err := os.OpenFile(out_name, os.O_WRONLY|os.O_CREATE, 0600)
	if err != nil {
		return nil, err
	}
	defer fid.Close()

	logger.SetOutput(fid)
    logger.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	return logger, nil
}
