"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.significance = significance;
function significance(val) {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        orientation: 'horizontal',
        offset: val
    };
}
