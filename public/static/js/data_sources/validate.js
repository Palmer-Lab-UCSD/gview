"use strict";
/**
 * Interface definitions for ApiRequests and runtime validation functions
 *
 * 2025, Palmer Lab at UCSD
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApiRequestAssoc = isApiRequestAssoc;
exports.isApiRequestChr = isApiRequestChr;
exports.isApiRequestGene = isApiRequestGene;
function isApiRequestOptionsPlot(obj) {
    // required elements
    const out = obj !== undefined
        && obj !== null
        && typeof obj === "object"
        && typeof obj.projectId === "string"
        && typeof obj.phenotype === "string"
        && typeof obj.chr === "string";
    if (!out)
        return false;
    if ("build" in obj && typeof obj.build !== "string")
        return false;
    return true;
}
function isApiRequestAssoc(obj) {
    if (!isApiRequestOptionsPlot(obj)) {
        return false;
    }
    return typeof obj.halfRegionSize === "number"
        && typeof obj.start === "number"
        && typeof obj.end === "number";
}
function isApiRequestChr(obj) {
    return isApiRequestOptionsPlot(obj);
}
function isApiRequestGene(obj) {
    return obj !== undefined
        && obj !== null
        && typeof obj.chr === "string"
        && typeof obj.start === "number"
        && typeof obj.end === "number";
}
