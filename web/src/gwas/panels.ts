/** Panels and layouts
 *
 * Palmer Lab at UCSD
 * 2025
 */
import * as PlabDataLayers from "./data_layers.js";


const HEIGHT_GENE_ANNOTATION: number = 300;
const MIN_HEIGHT_GENE_ANNOTATION: number = 150;
const HEIGHT_ASSOC: number = 300;
const MARGIN: Margin = { top: 35, right: 55, bottom: 40, left: 70 };
const INNER_BORDER: string = 'rgb(210, 210, 210)';

/** Construct panel for gene tracks and annotations
 * 
 * @param {string} namespace is the name assigned to the data
 *      resource for which this panel is updated.
 * @returns {Object} an object that defines a panel consistent
 *      with the requirements of locuszoom.js
 */
function genes(namespace: string): PanelGene {
    return {
        id: "gene_tracks",
        height: HEIGHT_GENE_ANNOTATION,
        margin: MARGIN,
        min_height: MIN_HEIGHT_GENE_ANNOTATION,
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
function assocBase(chr: string): PanelAssoc {
    return {
        id: "",
        height: HEIGHT_ASSOC,
        margin: MARGIN,
        inner_border: INNER_BORDER,
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
        data_layers: []
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
function locusAssoc(dataNamespace: string,
    chr: string,
    xfield: string,
    yfield: string,
    sigVal: number): PanelAssoc {

    let panel_struct = assocBase(chr);

    panel_struct.id= "assoc";

    panel_struct.min_region_scale = 100000;       // 100 Kb
    panel_struct.max_region_scale = 100000000;     // 100 Mb

    panel_struct.interaction = {
        drag_background_to_pan: true,
        scroll_to_zoom: true
    };

    panel_struct.data_layers.push(
        PlabDataLayers.associationPvalues(dataNamespace, xfield, yfield)
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
function chrAssoc(dataNamespace: string,
    chr: string,
    xfield: string,
    yfield: string): PanelAssoc {

    let panel_struct = assocBase(chr);

    panel_struct.id = "chrOverview";
    panel_struct.data_layers.push(
            PlabDataLayers.chrOverview(dataNamespace, xfield, yfield)
    ); 

    return panel_struct;
}

export {
    genes,
    locusAssoc,
    chrAssoc
}