
import * as PlabGwas from "./gwas.js";
import { uiState } from "./gwas/uiState.js";

console.log(LocusZoom)
console.log(PlabGenes)
LocusZoom.DataLayers.add("plab_genes", PlabGwas.PlabGenes)
let plotListener = null
let plots = []

let queryElements = new Map();
queryElements.set("projectId",
    document.getElementById("projectId"));
queryElements.set("phenotype",
    document.getElementById("phenotype"));
queryElements.set("chr",
    document.getElementById("chr"));

// TODO: How do I reset all options under page refresh
queryElements.get("projectId").eventProcessor = PlabGwas.queryDataSourcesFromSelectors("/api/gwas/phenotypes",
    [],
    "projectId",
    ["phenotype", "chr"]);
queryElements.get("phenotype").eventProcessor = PlabGwas.queryDataSourcesFromSelectors("/api/gwas/chr",
    ["projectId"],
    "phenotype",
    ["chr"]);

queryElements.get("chr").eventProcessor = PlabGwas.initAll("projectId",
    "phenotype",
    "chr",
    {
        chrOverview: "lzChrOverview",
        locusOfInterest: "lzLocusOfInterest"
    });

PlabGwas.createListeners(queryElements)
console.log(uiState);