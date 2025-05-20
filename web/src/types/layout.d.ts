/**
 * Definition of state variable for distinct plots
 */



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
