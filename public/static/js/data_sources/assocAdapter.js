"use strict";
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
exports.AssocAdapter = void 0;
const Validate = __importStar(require("./validate.js"));
class AssocAdapter extends LocusZoom.Adapters.get("BaseLZAdapter") {
    _getURL(request_options) {
        // TODO fix genome build
        // options.append('build', BUILD)
        if (!Validate.isApiRequestAssoc(request_options))
            throw new Error("not does not have type ApiRequestOptionsPlot");
        const options = new URLSearchParams();
        options.append('projectId', request_options.projectId);
        options.append('phenotype', request_options.phenotype);
        options.append('chr', request_options.chr);
        options.append('start', request_options.start.toString());
        options.append('end', request_options.end.toString());
        return `${this._url}?${options}`;
    }
    _normalizeResponse(response_text, _) {
        //let data = super._normalizeResponse(response_text, options);
        //data = data.data || data;
        return JSON.parse(response_text);
    }
}
exports.AssocAdapter = AssocAdapter;
