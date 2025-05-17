
import * as Validate from "./validate.js";

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

    _normalizeResponse(response_text: string, _: ApiRequestChr): any {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        const tmp = JSON.parse(response_text);
        console.log(tmp);
        return tmp;
    }
}


export { ChrSubsetAdapter }