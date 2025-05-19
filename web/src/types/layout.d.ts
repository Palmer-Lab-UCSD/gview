/**
 * Definition of state variable for distinct plots
 */



declare interface GeneTooltipVis {
    or?:    Array<string>;
    and?:   Array<string>;
};

declare interface GeneTooltip {
    closeable: boolean;
    show: GeneTooltipVis;
    hide: GeneTooltipVis;
    html: string;
};

declare interface MouseSettings {
    action?:        string;
    status?:        string;
    exclusive?:     boolean;
};

declare interface MouseBehaviors {
    onmouseover:    Array<MouseSettings>;
    onmouseout:     Array<MouseSettings>;
    onclick:        Array<MouseSettings>;
};

/**
 * Defines the type for a gene track data_layer element
 */
declare interface GeneLayerSettings {
    stroke:                     string;
    color:                      string;
    label_font_size:            number;
    label_exon_spacing:         number; 
    exon_height:                number; 
    bounding_box_padding:       number; 
    track_vertical_spacing:     number; 
    tooltip_positioning:        "horizontal" | "vertical" | "top" | "bottom" | "left" | "right";
    tooltip:                    GeneTooltip;
    behaviors:                  MouseBehaviors;
};


declare interface ChrState {
    projectId:      string;
    phenotype:      string;
    chr:            string;
    build?:         string;
}

declare interface AssocState extends ChrState {
    start:          string;
    end:            string;
}


declare interface AxisSettings {
   field:           string;
   axis?:           number;
   floor?:          number;
   upper_buffer?:   number;
   min_extent?:     Array<number>;
}