"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlabApiAdapters = void 0;
const assocAdapter_js_1 = require("./assocAdapter.js");
const chrSubsetAdapter_js_1 = require("./chrSubsetAdapter.js");
const geneAdapter_js_1 = require("./geneAdapter.js");
exports.PlabApiAdapters = {
    AssocAdapter: assocAdapter_js_1.AssocAdapter,
    ChrSubsetAdapter: chrSubsetAdapter_js_1.ChrSubsetAdapter,
    GeneAdapter: geneAdapter_js_1.GeneAdapter
};
