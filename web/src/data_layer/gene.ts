/** 
 * Panel data_layer definitions
 *
 * Palmer Lab at UCSD
 * 2025
 */



function gene(namespace: string): GeneTrackLayer {
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

export { gene }