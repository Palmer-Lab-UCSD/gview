/**
 * Palmer lab locuszoom.js adapters 
 * 
 * These adapters incorport knowledge of the Palmer Lab data API
 * for serving the correct information to locuszoom.js plots.
 * 
 * 
 * 2025, Palmber Lab at UCSD
 */

import * as Validate from "./validate.js";


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

    _normalizeResponse(response_text: string, _: ApiRequestGene): any {
        return JSON.parse(response_text)
    }
}

export { GeneAdapter };