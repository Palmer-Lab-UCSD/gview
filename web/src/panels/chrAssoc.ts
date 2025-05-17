
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

export { chrAssoc };