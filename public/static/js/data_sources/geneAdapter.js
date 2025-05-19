"use strict";
/**
 * Palmer lab locuszoom.js adapters
 *
 * These adapters incorport knowledge of the Palmer Lab data API
 * for serving the correct information to locuszoom.js plots.
 *
 *
 * 2025, Palmber Lab at UCSD
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneAdapter = void 0;
const Validate = __importStar(require("./validate.js"));
class GeneAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL(request_options) {
        if (!Validate.isApiRequestGene(request_options))
            throw new Error("Not correct type");
        const options = new URLSearchParams();
        // TODO fix genome build
        options.append('chr', request_options.chr);
        options.append('start', request_options.start.toString());
        options.append('end', request_options.end.toString());
        return `${this._url}?${options}`;
    }
    _normalizeResponse(response_text, _) {
        return JSON.parse(response_text);
    }
}
exports.GeneAdapter = GeneAdapter;
