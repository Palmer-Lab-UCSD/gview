"use strict";
/** Panels and layouts
 *
 * Palmer Lab at UCSD
 * 2025
 */
// import * as PlabDataLayers from "./data_layers.js";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlabPanels = void 0;
const locusAssoc_1 = require("./locusAssoc");
const chrAssoc_1 = require("./chrAssoc");
const geneTracks_1 = require("./geneTracks");
exports.PlabPanels = {
    locusAssoc: locusAssoc_1.locusAssoc,
    chrAssoc: chrAssoc_1.chrAssoc,
    geneTracks: geneTracks_1.geneTracks,
};
