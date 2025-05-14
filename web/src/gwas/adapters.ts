/**
 * Palmer lab locuszoom.js adapters 
 * 
 * These adapters incorport knowledge of the Palmer Lab data API
 * for serving the correct information to locuszoom.js plots.
 * 
 * 
 * 2025, Palmber Lab at UCSD
 */

import * as Validate from "../types/validate.js"


class ChrSubsetAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {

    _getURL (request_options: ApiRequestChr) {

        if (!Validate.isApiRequestChr(request_options))
            throw new Error("request options do not meet required structure");

        const options = new URLSearchParams();
        options.append("projectId", request_options.projectId);
        options.append("phenotype", request_options.phenotype);
        options.append("chr", request_options.chr);

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text: string, _: ApiRequestChr): JSON {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}

class AssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options: ApiRequestAssoc): string {
        // TODO fix genome build
        // options.append('build', BUILD)
        if (!Validate.isApiRequestAssoc(request_options)) 
            throw new Error("not does not have type ApiRequestOptionsPlot")

        const options = new URLSearchParams();

        options.append('projectId', request_options.projectId)
        options.append('phenotype', request_options.phenotype)
        options.append('chr', request_options.chr)
        options.append('start', request_options.start.toString())
        options.append('end', request_options.end.toString())

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text: string, _: ApiRequestAssoc): JSON {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}


class GeneAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL(request_options: ApiRequestGene): string {
        if (!Validate.isApiRequestGene(request_options))
            throw new Error("Not correct type");

        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('chr', request_options.chr)
        options.append('start', request_options.start.toString())
        options.append('end', request_options.end.toString())

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text: string, _: ApiRequestGene): JSON {
        return JSON.parse(response_text)
    }
}

export {
    GeneAdapter,
    ChrSubsetAdapter,
    AssocAdapter
}