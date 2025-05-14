/** Panel data_layer specifications
 *
 * Palmer Lab at UCSD
 * 2025
 */

function chrOverview(dataNamespace: string,
    xfield: string,
    yfield: string): AssocDataLayer {

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
            field: `assocOverview:${yfield}`,
            axis: 1,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}

function associationPvalues(dataNamespace: string,
    xfield: string,
    yfield: string): AssocDataLayer {
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

function significance(val: number): LineLayer {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        orientation: 'horizontal',
        offset: val
    };
}

function gene(namespace: string): GeneLayer {
    return {
        namespace: { 'genes': namespace },
        id: 'gene_tracks',
        type: 'plab_genes',
        id_field: 'genes:GeneId',
        gene_name_field: 'genes:GeneId',
        start_field: 'genes:Start',
        end_field: 'genes:End',
        strand_field: "genes:Strand"
    }
}

export { 
    associationPvalues,
    chrOverview,
    gene,
    significance
};