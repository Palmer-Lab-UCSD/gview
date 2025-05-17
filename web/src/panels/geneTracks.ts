
import * as Constants from "./constants.ts"

// TODO define array elment types
function geneTracks(dataLayers: Array<any>): PanelGene {
    return {
        id: "gene_tracks",
        height: Constants.HEIGHT_GENE_ANNOTATION,
        margin: Constants.MARGIN,
        min_height: Constants.MIN_HEIGHT_GENE_ANNOTATION,
        axes: {},
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        data_layers : dataLayers
    }
}

export { geneTracks };