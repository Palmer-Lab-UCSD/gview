/**
import * as PlabGwas from "./gwas.js";
import { uiState } from "./gwas/uiState.js";

console.log(LocusZoom)
console.log(PlabGenes)
let plotListener = null
let plots = []
*/

// import PlabLocusZoom from ".";

import { QueryElements,
    queryDataSourcesFromSelectors,
    createListeners } from "./services.js";
import { PlabDataLayers } from "../data_layer";

import * as PlabPlots from "./gwas/plots.js";

LocusZoom.DataLayers.add("plab_genes", PlabDataLayers.DataTypes.GeneTracks);

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
 * Bind all query elements to respective HTML select elements
 */
queryElements.set("projectId",
    document.getElementById("projectId") as DataHtmlSelectElement);
queryElements.set("phenotype",
    document.getElementById("phenotype") as DataHtmlSelectElement);
queryElements.set("chr",
    document.getElementById("chr") as DataHtmlSelectElement);


// TODO: How do I reset all options under page refresh
/**
 * Bind project id specification event api call
 */
let tmp: DataHtmlSelectElement | undefined = queryElements.get("projectId"); 
if (tmp === undefined)
    throw new Error("Project Id selector not defined")
tmp.eventProcessor = queryDataSourcesFromSelectors("/api/gwas/phenotypes",
    [],
    "projectId",
    ["phenotype", "chr"]);


/**
 * Bind phenotype specification event to api call
 */
tmp = queryElements.get("phenotype");
if (tmp === undefined)
    throw new Error("Phenotype selector not defined");
tmp.eventProcessor = queryDataSourcesFromSelectors("/api/gwas/chr",
    ["projectId"],
    "phenotype",
    ["chr"]);

/**
 * bind chr specification event to api call
 */
tmp = queryElements.get("chr");
if (tmp === undefined)
    throw new Error("chr selector not defined");
tmp.eventProcessor = PlabPlots.initAll("projectId",
    "phenotype",
    "chr",
    {
        chrOverview: "lzChrOverview",
        locusOfInterest: "lzLocusOfInterest"
    });


createListeners(queryElements);