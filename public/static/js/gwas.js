/**
import * as PlabGwas from "./gwas.js";
import { uiState } from "./gwas/uiState.js";

console.log(LocusZoom)
console.log(PlabGenes)
let plotListener = null
let plots = []
*/
import * as PlabGwas from "./gwas/services.js";
import { PlabGenes } from "./gwas/genes.js";
import * as PlabPlots from "./gwas/plots.js";
LocusZoom.DataLayers.add("plab_genes", PlabGenes);
let queryElements = new PlabGwas.QueryElements();
queryElements.set("projectId", document.getElementById("projectId"));
queryElements.set("phenotype", document.getElementById("phenotype"));
queryElements.set("chr", document.getElementById("chr"));
// TODO: How do I reset all options under page refresh
let tmp = queryElements.get("projectId");
if (tmp === undefined)
    throw new Error("Project Id selector not defined");
tmp.eventProcessor = PlabGwas.queryDataSourcesFromSelectors("/api/gwas/phenotypes", [], "projectId", ["phenotype", "chr"]);
tmp = queryElements.get("phenotype");
if (tmp === undefined)
    throw new Error("Phenotype selector not defined");
tmp.eventProcessor = PlabGwas.queryDataSourcesFromSelectors("/api/gwas/chr", ["projectId"], "phenotype", ["chr"]);
tmp = queryElements.get("chr");
if (tmp === undefined)
    throw new Error("chr selector not defined");
tmp.eventProcessor = PlabPlots.initAll("projectId", "phenotype", "chr", {
    chrOverview: "lzChrOverview",
    locusOfInterest: "lzLocusOfInterest"
});
PlabGwas.createListeners(queryElements);
