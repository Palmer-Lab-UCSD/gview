
/**
 * Type definitions of data_layers to be used in plots
 * 
 * 2025, Palmer Lab
 */


interface BaseLayer {
    id:             string;
    type:           string;
    id_field:       string;
}

/**
 * Mapping of data references
 * 
 * When defining a data source we provide a reference label and
 * an adapter instance.  The namespace property is a map from
 * the data source reference used in the data_layer to that defined
 * by the adapter.
 */
interface NameSpaceLayer extends BaseLayer {
    namespace: Record<string, string>;
}

/**
 * Assocation data_layer is a scatter plot of chromsome position (x-axis)
 * and association statistic (y-axis).
 */
declare interface AssocDataLayer extends NameSpaceLayer {
    x_axis:         AxisSettings;
    y_axis:         AxisSettings;
    point_size?:    number;
    color?:         Array<string>;
}

/**
 * Data layer for managing GeneTrack data
 */
declare interface GeneTrackLayer extends NameSpaceLayer {
    gene_name_field:    'genes:GeneId',    // required
    start_field:        'genes:Start',         // required
    end_field:          'genes:End',             // required
    strand_field:       "genes:Strand"        // required
}

declare interface LineLayer {
    id:             string;
    type:           string;
    orientation:    string;
    offset:         number;
}

