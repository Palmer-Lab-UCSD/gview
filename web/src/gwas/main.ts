/**
 * Entry point for visualization 
 * 
 */

import { 
    QueryElements,
    queryDataSourcesFromSelectors,
    createListeners 
} from "./services.js";

import { PlabDataLayers } from "../data_layer/index.js";

import * as PlabPlots from "./plots.js";

LocusZoom.DataLayers.add("plab_genes", PlabDataLayers.DataType.GeneTracks);

/**
 * Query elements are those that the user manipulates to specify
 * a data base query.
 * 
 * Recall that QueryElements is simply a JavaScript Map in which I 
 * limit the key and values to string and DataHtmlSelectElement, 
 * respecitively.
 */
let queryElements = new QueryElements();

/**
 * Set projectId selector
 */

let tmp: DataHtmlSelectElement = document.getElementById("projectId") as DataHtmlSelectElement;
if (tmp === null)
    throw new Error("No projectId");
tmp.eventProcessor = queryDataSourcesFromSelectors("/api/gwas/phenotypes",
    [],
    "projectId",
    ["phenotype", "chr"]);
queryElements.set("projectId", tmp);


/** 
 * Set phenotype selector 
 */
tmp = document.getElementById("phenotype") as DataHtmlSelectElement;
if (tmp === null)
    throw new Error("phenootype not defined")
tmp.eventProcessor = queryDataSourcesFromSelectors("/api/gwas/chr",
    ["projectId"],
    "phenotype",
    ["chr"]);
queryElements.set("phenotype", tmp);

/**
 * Set chromosome
 */
tmp = document.getElementById("chr") as DataHtmlSelectElement;
if (tmp === null)
    throw new Error("chr not specified")
tmp.eventProcessor = PlabPlots.initAll("projectId",
    "phenotype",
    "chr",
    {
        chrOverview: "lzChrOverview",
        locusOfInterest: "lzLocusOfInterest"
    });
queryElements.set("chr", tmp);


createListeners(queryElements);