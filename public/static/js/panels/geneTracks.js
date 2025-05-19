"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geneTracks = geneTracks;
const constants_js_1 = require("./constants.js");
// TODO define array elment types
function geneTracks(dataLayers) {
    return {
        id: "gene_tracks",
        height: constants_js_1.constants.HEIGHT_GENE_ANNOTATION,
        margin: constants_js_1.constants.MARGIN,
        min_height: constants_js_1.constants.MIN_HEIGHT_GENE_ANNOTATION,
        axes: {},
        interaction: {
            drag_background_to_pan: true,
            scroll_to_zoom: true
        },
        data_layers: dataLayers
    };
}
