

import { assocBase } from "./assocBase.js";


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

export { locusAssoc };