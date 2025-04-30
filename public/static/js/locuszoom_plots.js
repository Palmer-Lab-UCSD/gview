
function plot() {
    LocusZoom.Adapters.add("MyAdapter", MyAdapter);


    LocusZoom.Adapters.add("MyGeneAdapter", MyGeneAdapter);
    
    // let assocAdapter = new MyAdapter({url: '/public/ds/assoc_corrected.json'})
    let data_sources = new LocusZoom.DataSources()
            .add("assoc", ['MyAdapter', {url: "/public/ds/assoc_corrected.json"}]);
            // .add("gene", ["MyGeneAdapter", {url: "/public/ds/data_transcripts.json"}]);

    
    return LocusZoom.populate('#lzplot', data_sources, layout);
}