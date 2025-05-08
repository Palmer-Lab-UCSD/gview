// Parameters, Functions, and Classes for locuszoom.js plots
//
// Palmer Lab at UCSD 2025
// 

// ============================================================
// Constants

const URLS = {
    GET_INIT_POS: '/api/gwas/initPos',
    GET_CHR_OVERVIEW: '/api/gwas/chrOverview',
    GET_ASSOC_DATA: '/api/gwas/loci',
    GET_GENE_DATA: '/api/gwas/gene',
    GET_CHROM_POS: '/api/gwas/chrStats'
};

const PLOT_PARS = {
    HEIGHT_CHR_OVERVIEW: 200,
    HEIGHT_ASSOC: 300,
    HEIGHT_GENE_ANNOTATION: 300,
    MIN_HEIGHT_GENE_ANNOTATION: 150,
    WIDTH: 900
}


// TODO Add real statistical significance value instead of setting sigVal
const BUILD = 'mRatBN7.2';
const HALF_REGION_SIZE = 500000;
const SIG_VAL = 5;


// ============================================================
// Adapters

class PlabChrWideSubsetAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
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
        console.log(tmp);
        return tmp;
    }
}

class PlabAssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL (request_options) {
        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('build', BUILD)
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


class PlabGeneAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
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

// ============================================================
// Data Layers

function data_layer_chr_overview(dataNamespace, xfield, yfield) {
    return {
        namespace: { 'assocOverview': dataNamespace },
        id: 'chrOverviewAssoc',
        type: 'scatter',
        id_field: 'assocOverview:Pos',
        point_size: 10,
        color: [
            '#005493',
        ],
        x_axis: {
            field: `assocOverview:${xfield}`,
        },
        y_axis: {
            axis: 1,
            field: `assocOverview:${yfield}`,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}

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
        orientation: 'horizontal',
        offset: val
    };
}

function data_layer_gene(namespace) {
    return {
        namespace: { 'genes': namespace },  // required
        id: 'gene_tracks',
        type: 'plab_genes',                 // required
        id_field: 'genes:GeneId',           // required
        gene_name_field: 'genes:GeneId',    // required
        start_field: 'genes:Start',         // required
        end_field: 'genes:End',             // required
        strand_field: "genes:Strand"        // required
    }
}
// function data_layer_gene(namespace) {
//     return {
//         namespace: { 'intervals': namespace },
//         id: 'intervals',
//         type: 'intervals',
//         tag: 'intervals',
//         id_field: '{{intervals:GeneId}}',
//         start_field: 'intervals:Start',
//         end_field: 'intervals:End',
//         track_split_field: 'intervals:GeneId',
//         track_label_field: 'intervals:GeneId',
//         label_field: 'intervals:GeneId',
//         split_tracks: true,
//         always_hide_legend: true,
//         color: '#B8B8B8',
//         legend: [], // Placeholder; auto-filled when data loads.
//         track_height: 15,
//         track_vertical_spacing: 5,
//         fill_opacity: 0.7,
//         // Add mouse behaviors
//         tooltip_position: 'vertical',
//         tooltip: {
//             closable: false,
//             show: {or: ["highlighted", "selected"]},
//             hide: {and: ["unhighlighted", "unselected"]},
//             html: "<div style='padding: 5px; border-radius: 3px;'>" +
//                   "<em><strong>{{intervals:GeneId}}</strong></em><br>" +
//                   "Refseq: {{intervals:Chr}}<br>" +
//                   "Position: {{intervals:Start}}-{{intervals:End}}<br>" +
//                   "Type: {{intervals:GeneBiotype}}" +
//                   "</div>"
//         },
//         behaviors: {
//             onmouseover: [
//                 { action: "set", status: "highlighted" }
//             ],
//             onmouseout: [
//                 { action: "unset", status: "highlighted" }
//             ],
//             onclick: [
//                 { action: "toggle", status: "selected", exclusive: true }
//             ]
//         }
//     }
// }


// ============================================================
// Panels

function panel_genes(namespace) {
    return {
        id: "gene_tracks",
        min_height: PLOT_PARS.MIN_HEIGHT_GENE_ANNOTATION,
        height: PLOT_PARS.HEIGHT_GENE_ANNOTATION,
        margin: { top: 35, right: 55, bottom: 40, left: 70 },
        axes: {},
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        data_layers : [
            data_layer_gene(namespace)
        ]
    }
}

function panel_association(dataNamespace, chr, xfield, yfield, SIG_VAL) {
    const data_layers = [
        data_layer_association_pvalues(dataNamespace, xfield, yfield),
        data_layer_significance(SIG_VAL)
    ];

    return {
        id: "assoc",
        height: PLOT_PARS.HEIGHT_ASSOC, 
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

function panel_chr_overview(dataNamespace, chr, xfield, yfield) {
    return {
        id: "chrOverview",
        height: PLOT_PARS.HEIGHT_CHR_OVERVIEW,
        margin: { top: 35, right: 55, bottom: 40, left: 70 },
        inner_border: 'rgb(210, 210, 210)',
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
        data_layers : [
            data_layer_chr_overview(dataNamespace, xfield, yfield)
        ]
    }
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
function association_layout(state,
    panels,
    height=PLOT_PARS.HEIGHT_ASSOC,
    width=PLOT_PARS.WIDTH) {
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


async function makeChromosomeOverviewFigure(options, chrStats, htmlIdForFigure) {

    const dataNamespace = "assocOverview";

    const chrOverviewAdapter = new PlabChrWideSubsetAdapter({
        url: URLS.GET_CHR_OVERVIEW
    });

    const data_sources = new LocusZoom.DataSources()
         .add(dataNamespace, chrOverviewAdapter);

    const layout = {
        height: PLOT_PARS.HEIGHT_CHR_OVERVIEW,
        width: PLOT_PARS.WIDTH,
        state: {
            projectId: options.get("projectId"),
            phenotype: options.get("phenotype"),
            chr: options.get("chr"),
            start: chrStats.Start,
            end: chrStats.End
        },
        responsive_resize: true,
        panels: [
            panel_chr_overview(dataNamespace, options.get("chr"), "Pos", "NegLogPval")
        ]
    }

    plots.push(LocusZoom.populate(`#${htmlIdForFigure}`,
        data_sources,
        layout));
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
        url: URLS.GET_ASSOC_DATA
    });

    const geneAdapter = new PlabGeneAdapter({
        url: URLS.GET_GENE_DATA,
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

    plots.push(LocusZoom.populate(`#${htmlIdForFigure}`,
        data_sources,
        layout));


    // plot.on("region_changed",
    //     (event) => {
    //         console.log('LZplot event: ', event)
    // });
}


async function getInitPositions(options) {
    const response = await fetch(`${URLS.GET_INIT_POS}?${options}`);
    if (!response.ok) {
        throw new Error("Couldn't get initial position")
    }
    // remember that response.json() returns a promise
    return response.json();
}

async function getChrStats(options) {
    const response = await fetch(`${URLS.GET_CHROM_POS}?${options}`);

    if (!response.ok) {
        throw new Error("Couldn't get chromosome position")
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
        options.append("build", BUILD)
        options.append("projectId",
            queryElements.get(htmlIdForProjectId).value);
        options.append("phenotype",
            queryElements.get(htmlIdForPhenotype).value);
        options.append("chr",
            queryElements.get(htmlIdForChr).value);
        options.append("halfRegionSize", HALF_REGION_SIZE) // 0.5 Mb

        // Construct overview plot
        const chrStats = await getChrStats(options);
        console.log(chrStats)
        makeChromosomeOverviewFigure(options, chrStats, htmlIdsForPlots.chrOverview);


        // Construct fine-scale plot
        const posits = await getInitPositions(options)

        options.append('start', posits[0]);
        options.append('end', posits[1]);

        let state = {};
        options.entries().forEach((w) => {state[w[0]] = w[1]});

        // TODO need to query sigVal from data
        makeLocusOfInterestFigure(state, SIG_VAL, htmlIdsForPlots.locusOfInterest);
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