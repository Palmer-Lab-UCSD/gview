// Parameters, Functions, and Classes for locuszoom.js plots
//
// Palmer Lab at UCSD 2025
// 

// ============================================================
// Constants

const urls = {
    getInitPos: '/api/gwas/initPos',
    getChrOverview: '/api/gwas/chrOverview',
    getAssocData: '/api/gwas/loci',
    getGeneData: '/api/gwas/gene'
};


const build = 'mRatBN7.2'


// ============================================================
// Adapters


class PlabAssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('build', build)
        options.append('projectId', request_options.projectId)
        options.append('phenotype', request_options.phenotype)
        options.append('chr', request_options.chr)
        options.append('start', request_options.start)
        options.append('end', request_options.end)

        return `${urls.getAssocData}?${options}`
    }

    _normalizeResponse(response_text, _) {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}


class PlabGeneAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('chr', request_options.chr)
        options.append('start', request_options.start)
        options.append('end', request_options.end)

        return `${urls.getGeneData}?${options}`
    }

    _normalizeResponse(response_text, options) {
        return JSON.parse(response_text)
    }
}

// ============================================================
// Data Layers

function data_layer_association_pvalues(dataNamespace, xfield, yfield) {
    return {
        namespace: { 'assoc': dataNamespace },
        id: 'associationpvalues',
        type: 'scatter',
        id_field: 'assoc:Snp',
        tag:"associatoinpvalues",
        color: [
            '#005493',
        ],
        x_axis: {
            field: `assoc:${xfield}`,
        },
        y_axis: {
            axis: 1,
            field: `assoc:${yfield}`,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}

function data_layer_significance(val) {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        tag: 'significance',
        orientation: 'horizontal',
        offset: val
    };
}

function data_layer_gene(namespace) {
    return {
        namespace: { 'intervals': namespace },
        id: 'intervals',
        type: 'intervals',
        tag: 'intervals',
        id_field: '{{intervals:GeneId}}',
        start_field: 'intervals:Start',
        end_field: 'intervals:End',
        track_split_field: 'intervals:GeneId',
        track_label_field: 'intervals:GeneId',
        label_field: 'intervals:GeneId',
        // split_tracks: true,
        always_hide_legend: true,
        color: '#B8B8B8',
        legend: [], // Placeholder; auto-filled when data loads.
        track_height: 15,
        track_vertical_spacing: 5,
        fill_opacity: 0.7,
        // Add mouse behaviors
        tooltip_position: 'vertical',
        tooltip: {
            closable: false,
            show: {or: ["highlighted", "selected"]},
            hide: {and: ["unhighlighted", "unselected"]},
            html: "<div style='padding: 5px; border-radius: 3px;'>" +
                  "<em><strong>{{intervals:GeneId}}</strong></em><br>" +
                  "Refseq: {{intervals:Chr}}<br>" +
                  "Position: {{intervals:Start}}-{{intervals:End}}<br>" +
                  "Type: {{intervals:GeneBiotype}}" +
                  "</div>"
        },
        behaviors: {
            onmouseover: [
                { action: "set", status: "highlighted" }
            ],
            onmouseout: [
                { action: "unset", status: "highlighted" }
            ],
            onclick: [
                { action: "toggle", status: "selected", exclusive: true }
            ]
        }
    }
}


// ============================================================
// Panels

function panel_genes(namespace) {
    return {
        id: "gene_intervals",
        tag: "intervals",
        height: 300,
        margin: { top: 35, right: 55, bottom: 40, left: 70 },
        axes: {
            x: {
                extent: "state"
            }
        },
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        data_layers : [
            data_layer_gene(namespace)
        ]
    }
}

function panel_association(dataNamespace, chr, xfield, yfield, sigVal) {
    const data_layers = [
        data_layer_association_pvalues(dataNamespace, xfield, yfield),
        data_layer_significance(sigVal)
    ];

    return {
        id: "assoc",
        height: 300,
        margin: { top: 35, right: 55, bottom: 40, left: 70 },
        inner_border: 'rgb(210, 210, 210)',
        min_region_scale: 100000,       // 100 Kb
        max_region_scale:100000000,     // 100 Mb
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        axes: {
            x: {
                label: `Chromosome ${chr} (Mb)`,
                label_offset: 38,
                tick_format: 'region',
                extent: 'state',
            },
            y1: {
                label: '-log10 p-value',
                label_offset: 50,
            }
        },
        data_layers : data_layers
    };

}

// ============================================================
// Layouts

// Args
//  state: javascript object
//      {
//          build: 
//          projectId: 
//          phenotype:
//          chr: chromosome index (string),
//          start: Plot x minimum (positive integer),
//          end: Plot x maximum (positive integer)
//      }
//  data_layers: array of output layer javascript objects, these are the
//      objects returned by functions 'layer_*'
//      [ouput_layer_func, output_layer_func, ...]
//  width:  plot (integer)
function association_layout(state, panels, height=500, width=900) {
    return {
        height: height,
        width: width,
        state: state,
        responsive_resize: true,
        panels: panels
    };
}


// ============================================================
// construct plot


async function makeChromosomeOverviewFigure(options, htmlIdForFigure) {
    console.log('makeChromsomeoverview');
    console.log(`url: ${urls.getChrOverview}`);
    console.log(`options: ${options}`);
    console.log(`options: ${htmlIdForFigure}`);
}


/**
 * Locus of interest plot
 * 
 * Here we display the association statistics and gene tracks for a small
 * region of a chromosome.  This will facilitate detailed analyses by 
 * researcher.
 * 
 *  @param {string} url to api service
 *  @param {Map} state as defined by locuszoom.js, required fields:
 *      - build: String (mRatBN7.2)
 *      - projectId: String 
 *      - phenotype: String 
 *      - chr: string
 *      - start: positive int
 *      - end: positive int
 *  @param {string} id of html tag in which the figure is placed.
*/
async function makeLocusOfInterestFigure(state, sigVal, htmlIdForFigure) {

    const assocAdapter = new PlabAssocAdapter({
        url: urls.getAssocData
    });

    const geneAdapter = new PlabGeneAdapter({
        url: urls.getGeneData,
    });
    
    const data_sources = new LocusZoom.DataSources()
         .add("assoc", assocAdapter)
         .add("gene", geneAdapter);

    const layout = association_layout(state, 
        [
            panel_association("assoc", state.chr, "Pos", "NegLogPval", sigVal),
            panel_genes("gene")
        ]
    );

    plot = LocusZoom.populate(`#${htmlIdForFigure}`,
        data_sources,
        layout);

    // options = new URLSearchParams();
    // state.keys().forEach((key) => {
    //     options.append(key, state.get(key));
    // })

    // geneLayer = null;
    // fetch(`${url}?${options}`)  
    //     .then((event) => {
    //         if (!event.ok) {
    //             throw new Error("Http error for initializing LZ plot")
    //         }
    //         return event.json();
    //     })
    //     .then((positionBounds) => {

    // plot.on("region_changed",
    //     (event) => {
    //         console.log('LZplot event: ', event)
    // });
    // });
}


async function getInitPositions(options) {
    const response = await fetch(`${urls.getInitPos}?${options}`);

    if (!response.ok) {
        throw new Error("Couldn't get initial position")
    }

    // remember that response.json() returns a promise
    return response.json();
}

function initializeGwasPlots(htmlIdForProjectId,
        htmlIdForPhenotype,
        htmlIdForChr,
        htmlIdsForPlots) {

    return async function g(queryElements) {

        const options = new URLSearchParams();
        options.append("build", build)
        options.append("projectId",
            queryElements.get(htmlIdForProjectId).value);
        options.append("phenotype",
            queryElements.get(htmlIdForPhenotype).value);
        options.append("chr",
            queryElements.get(htmlIdForChr).value);
        options.append("halfRegionSize", 2500000) // 2.5 Mb

        // makes get request
        const posits = await getInitPositions(options)

        options.append('start', posits[0]);
        options.append('end', posits[1]);

        let state = {};
        options.entries().forEach((w) => {state[w[0]] = w[1]});

        makeChromosomeOverviewFigure(options, htmlIdsForPlots.chrOverview);

        // TODO need to query sigVal from data
        makeLocusOfInterestFigure(state, 5, htmlIdsForPlots.locusOfInterest);
    }
}



// function plot() {
//     LocusZoom.Adapters.add("MyAdapter", MyAdapter);
// 
// 
//     LocusZoom.Adapters.add("MyGeneAdapter", MyGeneAdapter);
//     
//     // let assocAdapter = new MyAdapter({url: '/public/ds/assoc_corrected.json'})
//     let data_sources = new LocusZoom.DataSources()
//             .add("assoc", ['MyAdapter', {url: "/public/ds/assoc_corrected.json"}]);
//             // .add("gene", ["MyGeneAdapter", {url: "/public/ds/data_transcripts.json"}]);
// 
//     
//     return LocusZoom.populate('#lzplot', data_sources, layout);
// }