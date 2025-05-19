

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