
function layer_association_pvalues(dataNamespace, xfield, yfield) {
    return {
        namespace: { 'assoc': dataNamespace },
        id: 'associationpvalues',
        type: 'scatter',
        id_field: 'assoc:Snp',
        tag:"associatoinpvalues",
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


function layer_significance(val) {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        tag: 'significance',
        orientation: 'horizontal',
        offset: val
    };
}

function layer_gene(namespace) {
    return {
        namespace:{"gene": namespace},
        id: "genes",
        type: "genes",
        tag: "genes",
        id_field: "gene_id"
    }
}

// Args
//  state: javascript object
//      {
//          genomeBuild: 
//          projectId: 
//          phenotype:
//          chr: chromosome index (string),
//          start: Plot x minimum (positive integer),
//          end: Plot x maximum (positive integer)
//      }
//  data_layers: array of output layer javascript objects, these are the
//      objects returned by functions 'layer_*'
//      [ouput_layer_func, output_layer_func, ...]
//  width:  plot (integer)
function association_layout(state, data_layers, height=500, width=900) {
    return {
        height: height,
        width: width,
        state: state,
        responsive_resize: true,
        panels: [
            {
                id: "assoc",
                height: 300,
                margin: { top: 35, right: 55, bottom: 40, left: 70 },
                inner_border: 'rgb(210, 210, 210)',
                min_region_scale: 100000,       // 100 Kb
                max_region_scale:100000000,     // 100 Mb
                interaction: {
                    drag_background_to_pan: true,
                    scroll_to_zoom: true
                },
                axes: {
                    x: {
                        label: `Chromosome ${state.chr} (Mb)`,
                        label_offset: 38,
                        tick_format: 'region',
                        extent: 'state',
                    },
                    y1: {
                        label: '-log10 p-value',
                        label_offset: 50,
                    }
                },
                data_layers : data_layers
            }
            // {
            //     id: "genes",
            //     height: 300,
            //     margin: { top: 35, right: 55, bottom: 40, left: 70 },
            //     data_layers : [
            //         gene_layer
            //     ]
            // }
        ]
    }
}
