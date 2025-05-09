/**
 * Palmer lab locuszoom.js adapters 
 * 
 * These adapters incorport knowledge of the Palmer Lab data API
 * for serving the correct information to locuszoom.js plots.
 * 
 * 
 * 2025, Palmber Lab at UCSD
 */

class ChrSubsetAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        options.append('projectId', request_options.projectId)
        options.append('phenotype', request_options.phenotype)
        options.append('chr', request_options.chr)

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text, _) {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        tmp = JSON.parse(response_text);
        return tmp;
    }
}

class AssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        // TODO fix genome build
        // options.append('build', BUILD)
        options.append('projectId', request_options.projectId)
        options.append('phenotype', request_options.phenotype)
        options.append('chr', request_options.chr)
        options.append('start', request_options.start)
        options.append('end', request_options.end)

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text, _) {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}


class GeneAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('chr', request_options.chr)
        options.append('start', request_options.start)
        options.append('end', request_options.end)

        return `${this._url}?${options}`
    }

    _normalizeResponse(response_text, options) {
        return JSON.parse(response_text)
    }
}

export {
    GeneAdapter,
    ChrSubsetAdapter,
    AssocAdapter
}