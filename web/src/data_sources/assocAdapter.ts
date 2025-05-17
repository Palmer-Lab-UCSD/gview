
import * as Validate from "./validate.js";

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

    _normalizeResponse(response_text: string, _: ApiRequestAssoc): any {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}

export { AssocAdapter };
