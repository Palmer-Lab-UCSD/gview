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

func processChrWideSubset(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	w.Header().Add("Content-Type", "application/json")

	var err error
	var output []service.GwasChrWideViewRecord

	output, err = service.GetChrWideSubset(db,
		r.URL.Query()["projectId"][0],
		r.URL.Query()["phenotype"][0],
		r.URL.Query()["chr"][0])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		output_json, _ := json.Marshal(make([]service.GwasChrWideViewRecord, 0))
		_, _ = w.Write(output_json)
		return err
	}

	output_json, err := json.Marshal(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		output_json, err = json.Marshal(make([]service.GwasChrWideViewRecord, 0))
		_, _ = w.Write(output_json)
		return err
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(output_json)
	if err != nil {
		return err
	}

	return nil
}

func processGeneQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	w.Header().Add("Content-Type", "application/json")

	var err error
	var output []service.GeneAnnotationRecord

	output, err = service.GetGenes(db,
		r.URL.Query()["chr"][0],
		r.URL.Query()["start"][0],
		r.URL.Query()["end"][0])

	var output_json []byte
	if err != nil {
		place_holder := make([]service.GeneAnnotationRecord, 0)
		w.WriteHeader(http.StatusInternalServerError)
		output_json, err = json.Marshal(place_holder)
		_, _ = w.Write(output_json)
		return err
	}

	output_json, err = json.Marshal(output)
	if err != nil {
		place_holder := make([]service.GeneAnnotationRecord, 0)
		w.WriteHeader(http.StatusInternalServerError)
		output_json, err = json.Marshal(place_holder)
		_, _ = w.Write(output_json)
		return err
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(output_json)
	if err != nil {
		return err
	}

	return nil
}

func processPhenoQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	fmt.Println(r.URL.Path)
	fmt.Println(r.URL.Query())

	var err error
	var output []string
	var tmp []string
	var ok bool

	query := r.URL.Query()

	if tmp, ok = query["projectId"]; !ok {
		return errors.New("project Id wasn't specified in request")
	}
	projId := tmp[0]
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
	var end []string
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

	if start, ok = q["start"]; !ok {
		return errors.New("start required input parameter")
	}

	if end, ok = q["end"]; !ok {
		return errors.New("end required input parameter")
	}

	var err error
	var startPos uint64
	if startPos, err = strconv.ParseUint(start[0], 10, 64); err != nil {
		return err
	}

	var endPos uint64
	if endPos, err = strconv.ParseUint(end[0], 10, 64); err != nil {
		return err
	}

	out, err := service.GetGwasBoundedLociRecords(db,
		schema[0],
		table[0],
		chr[0],
		startPos,
		endPos)

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

func processInitPositionsQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {

	q := r.URL.Query()
	var chr []string
	var schema []string
	var table []string
	var halfRegionSizeStr []string
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

	if halfRegionSizeStr, ok = q["halfRegionSize"]; !ok {
		return errors.New("halfRegionSize wasn't specified")
	}

	out, err := service.GetLocusAtMaxAssoc(db,
		schema[0],
		table[0],
		chr[0])
	if err != nil {
		return err
	}

	var output [2]uint64
	var halfRegionSize uint64
	halfRegionSize, err = strconv.ParseUint(halfRegionSizeStr[0], 10, 64)
	if err != nil {
		return err
	}
	if halfRegionSize > out {
		output[0] = uint64(0)
	} else {
		output[0] = out - halfRegionSize
	}

	output[1] = out + halfRegionSize

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

func processChrStatsQuery(w http.ResponseWriter,
	r *http.Request,
	db *service.OrgDb) error {
	// temporary solution until i get chrom data table configured

	var schema []string
	var table []string
	var chr []string
	var ok bool

	q := r.URL.Query()

	if schema, ok = q["projectId"]; !ok {
		return errors.New("project id not defined")
	}

	if table, ok = q["phenotype"]; !ok {
		return errors.New("phenotype id not defined")
	}

	if chr, ok = q["chr"]; !ok {
		return errors.New("chr not defined")
	}

	fmt.Println(schema, table, chr)
	chrStats, err := service.GetChrStats(schema[0], table[0], chr[0], db)
	if err != nil {
		return err
	}

	output_json, err := json.Marshal(chrStats)
	if err != nil {
		return err
	}

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
		case "phenotypes":
			f = processPhenoQuery
		case "chr":
			f = processChrQuery
		case "initPos":
			f = processInitPositionsQuery
		case "loci":
			f = processLociQuery
		case "gene":
			f = processGeneQuery
		case "chrOverview":
			f = processChrWideSubset
		case "chrStats":
			f = processChrStatsQuery
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

// 	out, err := service.GetGwasAllLociRecords(db,
// 		schema[0],
// 		table[0],
// 		chr[0])
// 	if err != nil {
// 		return err
// 	}
//
// 	lociStart := new(service.GwasLocusRecord)
// 	lociStop := new(service.GwasLocusRecord)
// 	var delta uint
// 	var deltaMax uint
//
// 	lociStart = &out[0]
// 	var i int
// 	for i = 1; i < len(out); i++ {
// 		// need this because working with unsigned ints
// 		if out[i].Pos < lociStart.Pos {
// 			lociStart = &(out[i])
// 			continue
// 		}
// 		delta = out[i].Pos - lociStart.Pos
// 		if delta > assocPlotMaxRange {
// 			lociStop = &(out[i])
// 			break
// 		}
//
// 		if deltaMax < delta {
// 			lociStop = &(out[i])
// 			deltaMax = delta
// 		}
// 	}
//
// 	var output [2]uint
//
// 	if lociStop.Pos > lociStart.Pos {
// 		output[0] = lociStart.Pos
// 		output[1] = lociStop.Pos
// 	} else {
// 		output[0] = lociStop.Pos
// 		output[1] = lociStart.Pos
// 	}
