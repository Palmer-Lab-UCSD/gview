"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chrAssoc = chrAssoc;
const assocBase_js_1 = require("./assocBase.js");
const index_js_1 = require("../data_layer/index.js");
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
    let panel_struct = (0, assocBase_js_1.assocBase)(chr);
    panel_struct.id = "chrOverview";
    panel_struct.data_layers.push(index_js_1.PlabDataLayers.chrOverview(dataNamespace, xfield, yfield));
    return panel_struct;
}
