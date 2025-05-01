package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/palmer-lab-ucsd/gview/internal/application"
	"github.com/palmer-lab-ucsd/gview/internal/service"
)

const (
	assocPlotMaxRange uint = 1000000
)

func processPhenoQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	var err error
	var output []string

	projId := r.URL.Query()["projectId"][0]
	output, err = service.GetPhenotypes(db, projId)

	w.Header().Add("Content-Type", "application/json")

	if err != nil {
		place_holder := make([]byte, 0)
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write(place_holder)

		return err
	}

	var output_json []byte
	w.WriteHeader(http.StatusOK)
	output_json, err = json.Marshal(output)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write(output_json)
		return err
	}

	_, err = w.Write(output_json)
	if err != nil {
		return err
	}

	return nil
}

func processChrQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	var err error
	var output []string

	projId := r.URL.Query()["projectId"][0]
	phenotypeId := r.URL.Query()["phenotype"][0]

	output, err = service.GetChrom(db, projId, phenotypeId)

	if err != nil {
		return err
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	var output_json []byte
	output_json, err = json.Marshal(output)
	if err != nil {
		return err
	}

	_, err = w.Write(output_json)
	if err != nil {
		return err
	}

	return nil
}

func processLociQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	q := r.URL.Query()
	var chr []string
	var schema []string
	var table []string
	var start []string
	var stop []string
	var ok bool
	fmt.Println(q)
	if chr, ok = q["chr"]; !ok {
		return errors.New("chr is required input parameter")
	}

	if schema, ok = q["projectId"]; !ok {
		return errors.New("projectId required input parameter")
	}

	if table, ok = q["phenotype"]; !ok {
		return errors.New("phenotype required input parameter")
	}

	if start, ok = q["start"]; !ok {
		return errors.New("start required input parameter")
	}

	if stop, ok = q["stop"]; !ok {
		return errors.New("start required input parameter")
	}

	var err error
	var startPos int
	if startPos, err = strconv.Atoi(start[0]); err != nil {
		return err
	}

	var stopPos int
	if stopPos, err = strconv.Atoi(stop[0]); err != nil {
		return err
	}

	out, err := service.GetGwasBoundedLociRecords(db,
		schema[0],
		table[0],
		chr[0],
		uint(startPos),
		uint(stopPos))

	if err != nil {
		return err
	}

	var output []byte
	output, err = json.Marshal(out)
	if err != nil {
		return err
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(output)
	if err != nil {
		return err
	}
	return nil
}

func processInitializeAssocPlotQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	q := r.URL.Query()
	var chr []string
	var schema []string
	var table []string
	var ok bool

	if chr, ok = q["chr"]; !ok {
		return errors.New("chr is required input parameter")
	}

	if schema, ok = q["projectId"]; !ok {
		return errors.New("projectId required input parameter")
	}

	if table, ok = q["phenotype"]; !ok {
		return errors.New("phenotype required input parameter")
	}

	out, err := service.GetGwasAllLociRecords(db,
		schema[0],
		table[0],
		chr[0])
	if err != nil {
		return err
	}

	lociStart := new(service.GwasLocusRecord)
	lociStop := new(service.GwasLocusRecord)
	var delta uint
	var deltaMax uint

	lociStart = &out[0]
	var i int
	for i = 1; i < len(out); i++ {
		// need this because working with unsigned ints
		if out[i].Pos < lociStart.Pos {
			lociStart = &(out[i])
			continue
		}
		delta = out[i].Pos - lociStart.Pos
		if delta > assocPlotMaxRange {
			lociStop = &(out[i])
			break
		}

		if deltaMax < delta {
			lociStop = &(out[i])
			deltaMax = delta
		}
	}

	var output [2]uint

	if lociStop.Pos > lociStart.Pos {
		output[0] = lociStart.Pos
		output[1] = lociStop.Pos
	} else {
		output[0] = lociStop.Pos
		output[1] = lociStart.Pos
	}

	var output_json []byte
	output_json, err = json.Marshal(output)
	if err != nil {
		return err
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(output_json)
	if err != nil {
		return err
	}

	return nil
}

func GwasApiHandlerFunc(app *application.Application) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		app.Log.PrintHttpRequest(r)

		var err error

		if r.Method != http.MethodGet {
			err = errors.New("http Error")
			app.Log.PrintError(err)
			return
		}

		var f func(http.ResponseWriter, *http.Request, *service.OrgDb) error

		switch filepath.Base(r.URL.Path) {
		case "phenos":
			f = processPhenoQuery
		case "chr":
			f = processChrQuery
		case "assoc":
			f = processInitializeAssocPlotQuery
		case "loci":
			f = processLociQuery
		default:
			err = errors.New("unsupported request")
			app.Log.PrintError(err)
			return
		}

		if err = f(w, r, app.Db); err != nil {
			app.Log.PrintError(err)
		}
	}
}
