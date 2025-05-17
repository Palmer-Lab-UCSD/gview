
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
};

export { assocBase };