"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlabDataLayers = void 0;
const associationPvalues_js_1 = require("./associationPvalues.js");
const gene_js_1 = require("./gene.js");
const line_js_1 = require("./line.js");
const chrOverview_js_1 = require("./chrOverview.js");
const index_js_1 = require("./types/index.js");
exports.PlabDataLayers = {
    associationPvalues: associationPvalues_js_1.associationPvalues,
    gene: gene_js_1.gene,
    significance: line_js_1.significance,
    chrOverview: chrOverview_js_1.chrOverview,
    DataType: index_js_1.DataType
};
