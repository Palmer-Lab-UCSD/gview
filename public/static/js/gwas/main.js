"use strict";
/**
 * Entry point for visualization
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const services_js_1 = require("./services.js");
const index_js_1 = require("../data_layer/index.js");
const PlabPlots = __importStar(require("./plots.js"));
LocusZoom.DataLayers.add("plab_genes", index_js_1.PlabDataLayers.DataType.GeneTracks);
/**
 * Query elements are those that the user manipulates to specify
 * a data base query.
 *
 * Recall that QueryElements is simply a JavaScript Map in which I
 * limit the key and values to string and DataHtmlSelectElement,
 * respecitively.
 */
let queryElements = new services_js_1.QueryElements();
/**
 * Set projectId selector
 */
let tmp = document.getElementById("projectId");
if (tmp === null)
    throw new Error("No projectId");
tmp.eventProcessor = (0, services_js_1.queryDataSourcesFromSelectors)("/api/gwas/phenotypes", [], "projectId", ["phenotype", "chr"]);
queryElements.set("projectId", tmp);
/**
 * Set phenotype selector
 */
tmp = document.getElementById("phenotype");
if (tmp === null)
    throw new Error("phenootype not defined");
tmp.eventProcessor = (0, services_js_1.queryDataSourcesFromSelectors)("/api/gwas/chr", ["projectId"], "phenotype", ["chr"]);
queryElements.set("phenotype", tmp);
/**
 * Set chromosome
 */
tmp = document.getElementById("chr");
if (tmp === null)
    throw new Error("chr not specified");
tmp.eventProcessor = PlabPlots.initAll("projectId", "phenotype", "chr", {
    chrOverview: "lzChrOverview",
    locusOfInterest: "lzLocusOfInterest"
});
queryElements.set("chr", tmp);
(0, services_js_1.createListeners)(queryElements);
