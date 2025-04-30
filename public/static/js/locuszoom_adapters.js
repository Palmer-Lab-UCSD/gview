class PlabAssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {

        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('genomeBuild', 'mRatBN7.2')
        options.append('projectId', request_options.projectId)
        options.append('phenotype', request_options.phenotype)
        options.append('chr', request_options.chr)
        options.append('start', request_options.start)
        options.append('stop', request_options.end)

        return `/api/gwas/loci?${options}`
    }

    _normalizeResponse(response_text, options) {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}

//class PlabGeneAdapter extends LocusZoom.Adapters.get("GeneLZ") {
//    _normalizeResponse(response_text, options) {
//        let data = super._normalizeResponse(response_text, options);
//        console.log(data[0]);
//        return data;
//    }
//}