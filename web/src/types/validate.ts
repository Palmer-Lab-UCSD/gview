/**
 * Interface definitions for ApiRequests and runtime validation functions
 * 
 * 2025, Palmer Lab at UCSD
 */


function isApiRequestOptionsPlot(obj: any): boolean {
    // required elements
    const out: boolean = obj !== undefined
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

function isApiRequestAssoc(obj: any): obj is ApiRequestAssoc {

    if (!isApiRequestOptionsPlot(obj)) {
        return false;
    }
    return typeof obj.halfRegionSize === "number"
        && typeof obj.start === "number"
        && typeof obj.end === "number";
}

function isApiRequestChr(obj: any): obj is ApiRequestChr {
    return isApiRequestOptionsPlot(obj)
}

function isApiRequestGene(obj: any): obj is ApiRequestGene {
    return obj !== undefined
        && obj !== null 
        && typeof obj.chr === "string"
        && typeof obj.start === "number"
        && typeof obj.end === "number";
}

export {
    isApiRequestAssoc,
    isApiRequestChr,
    isApiRequestGene
}