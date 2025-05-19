"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associationPvalues = associationPvalues;
function associationPvalues(dataNamespace, xfield, yfield) {
    return {
        namespace: { 'assoc': dataNamespace },
        id: 'associationpvalues',
        type: 'scatter',
        id_field: 'assoc:Snp',
        color: [
            '#005493',
        ],
        x_axis: {
            field: `assoc:${xfield}`,
        },
        y_axis: {
            axis: 1,
            field: `assoc:${yfield}`,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}
