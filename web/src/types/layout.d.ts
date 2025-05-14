/**
 * Definition of state variable for distinct plots
 */


declare interface AssocState {
    projectId:      string;
    phenotype:      string;
    chr:            string;
    start:          string;
    end:            string;
    build?:         string;
}

declare interface ChrState {
    projectId:      string;
    phenotype:      string;
    chr:            string;
}

declare interface AxisSettings {
   field:           string;
   axis?:           number;
   floor?:          number;
   upper_buffer?:   number;
   min_extent?:     Array<number>;
}


interface BaseLayer {
    id:             string;
    type:           string;
    id_field:       string;
}

interface NameSpaceLayer extends BaseLayer {
    namespace: Record<string, string>;
}

declare interface AssocDataLayer extends NameSpaceLayer {
    x_axis:         AxisSettings;
    y_axis:         AxisSettings;
    point_size?:    number;
    color?:         Array<string>;
}


declare interface GeneLayer extends NameSpaceLayer {
    gene_name_field: 'genes:GeneId',    // required
    start_field: 'genes:Start',         // required
    end_field: 'genes:End',             // required
    strand_field: "genes:Strand"        // required
}

declare interface LineLayer {
    id:             string;
    type:           string;
    orientation:    string;
    offset:         number;
}


interface Interaction {
    drag_background_to_pan: boolean;
    scroll_to_zoom:         boolean;
}

interface PanelAxis {
    label:          string;
    label_offset:   number;
    tick_format?:   string;
    extent?:        string;
}

interface PanelAxes {
    x:      PanelAxis;
    y1:     PanelAxis;
    y2?:    PanelAxes;
}

declare interface Margin {
    top:        number;
    right:      number;
    bottom:     number;
    left:       number;
}

interface PanelBase {
    id:                 string;
    height:             number;
    margin:             Margin;
    interaction:        Interaction;
    axes:               any;
    min_region_scale?:  number;
    max_region_scale?:  number;
    inner_border?:      string;
}

interface PanelGene extends PanelBase {
    min_height:         number;
    axes:               {};
    data_layers:        Array<GeneLayer>;
}

declare interface PanelAssoc extends PanelBase {
    axes:               PanelAxes;
    data_layers:        Array<AssocDataLayer | LineLayer>;
}