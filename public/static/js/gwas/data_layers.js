/** Panel data_layer specifications
 *
 * Palmer Lab at UCSD
 * 2025
 */

function chr_overview(dataNamespace, xfield, yfield) {
    return {
        namespace: { 'assocOverview': dataNamespace },
        id: 'chrOverviewAssoc',
        type: 'scatter',
        id_field: 'assocOverview:Pos',
        point_size: 10,
        color: [
            '#005493',
        ],
        x_axis: {
            field: `assocOverview:${xfield}`,
        },
        y_axis: {
            axis: 1,
            field: `assocOverview:${yfield}`,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}

function association_pvalues(dataNamespace, xfield, yfield) {
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

function significance(val) {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        orientation: 'horizontal',
        offset: val
    };
}

function gene(namespace) {
    return {
        namespace: { 'genes': namespace },  // required
        id: 'gene_tracks',
        type: 'plab_genes',                 // required
        id_field: 'genes:GeneId',           // required
        gene_name_field: 'genes:GeneId',    // required
        start_field: 'genes:Start',         // required
        end_field: 'genes:End',             // required
        strand_field: "genes:Strand"        // required
    }
}

export { 
    association_pvalues,
    chr_overview,
    gene,
    significance
};