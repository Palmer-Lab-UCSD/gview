/** Panels and layouts
 *
 * Palmer Lab at UCSD
 * 2025
 */
import * as PlabDataLayers from "./data_layers.js";


const HEIGHT_GENE_ANNOTATION = 300
const MIN_HEIGHT_GENE_ANNOTATION = 150
const HEIGHT_ASSOC = 300
const MARGIN = { top: 35, right: 55, bottom: 40, left: 70 }


/** Construct panel for gene tracks and annotations
 * 
 * @param {String} namespace is the name assigned to the data
 *      resource for which this panel is updated.
 * @returns {Object} an object that defines a panel consistent
 *      with the requirements of locuszoom.js
 */
function genes(namespace) {
    return {
        id: "gene_tracks",
        min_height: MIN_HEIGHT_GENE_ANNOTATION,
        height: HEIGHT_GENE_ANNOTATION,
        margin: MARGIN,
        axes: {},
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        data_layers : [
            PlabDataLayers.gene(namespace)
        ]
    }
}

/** 
 * Base requirements for a scatter plot of genetic associations
 * 
 * @param{String} chr
 */
function assocBase(chr) {
    return {
        id: null,
        height: HEIGHT_ASSOC,
        margin: MARGIN,
        inner_border: 'rgb(210, 210, 210)',
        min_region_scale: null,
        max_region_scale: null,
        interaction: {
            drag_background_to_pan: false,
            scroll_to_zoom: false
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
        data_layers : []
    }
}

// TODO: Figure out type for sigVal
/**
 * 
 * @param {String} dataNamespace 
 * @param {String} chr 
 * @param {String} xfield 
 * @param {String} yfield 
 * @param {*} sigVal 
 * @returns {Object} javascript object with necessary settings for
 * specifying a fine scale association plot 
 */
function locusAssoc(dataNamespace,
    chr,
    xfield,
    yfield,
    sigVal) {

    let panel_struct = assocBase(chr);

    panel_struct.id= "assoc";

    panel_struct.min_region_scale = 100000;       // 100 Kb
    panel_struct.max_region_scale = 100000000;     // 100 Mb

    panel_struct.interaction = {
        drag_background_to_pan: true,
        scroll_to_zoom: true
    };

    panel_struct.data_layers.push(
        PlabDataLayers.association_pvalues(dataNamespace, xfield, yfield)
    );
    panel_struct.data_layers.push(
        PlabDataLayers.significance(sigVal)
    );

    return panel_struct;
}

/**
 * 
 * @param {String} dataNamespace 
 * @param {String} chr 
 * @param {String} xfield 
 * @param {String} yfield 
 * @returns {Object} javascript object with necessary settings for
 * specifying a chr scale association plot 
 */
function chrAssoc(dataNamespace, chr, xfield, yfield) {
    let panel_struct = assocBase(chr);
    panel_struct.id = "chrOverview";
    panel_struct.data_layers.push(
            PlabDataLayers.chr_overview(dataNamespace, xfield, yfield)
    ); 
    return panel_struct;
}

export {
    genes,
    locusAssoc,
    chrAssoc
}