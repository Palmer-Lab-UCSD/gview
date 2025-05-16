
declare namespace LocusZoom {

    class Adapter {
        constructor(config: any)
        _url: string
        _getURL(request_options: any): string
        _normalizeResponse(response_text: string,
            options: any): any
    }

    class DataSources {
        constructor(registry?: Registry);
        add(namesapce: string,
            adapter: Adapter,
            override?: boolean): DataSources;
    }

    interface Registry {
        get(name: string): typeof Adapter
    }

    interface Panel {
        id:                     null | string;
        height:                 null | number;
        data_layers:            Array<number>;

        x_scale(val: number):           number;
        emit(eventName: string, element: Event, val: boolean): Panel;
        call(fn: (val: any) => any): Panel;
    }

    interface Plot {}

    interface PlotElements {
        group:      d3.Selection;
        container:  d3.Selection;
        clipRect:   d3.Selection;
    }

    interface Behavior {
        bind(name: any): any;
    }

    class DataLayer {
        constructor(layout: GeneLayerSettings, parent: Panel | null)
        parent:                                 Panel
        tracks:                                 number;
        gene_track_index:                       NumericKeyObj<any>;
        layout:                                 GeneLayerSettings;
        applyBehaviors:                         Behavior;

        state:                                  state;
        svg:                                    PlotElements;
        // data:                                   Array<Svg>;

        _applyFilters():                       Array<GeneTrackRecord>;
        getElementId(element: HTMLElement | d3.Selection):     string;

        emit(event_type: string, element:d3.Selection , val: boolean):   DataLayer;
        resolveScalableParameter(option_layout: string, element_data: GeneTrackRecord, data_index: number):  GeneTrackRecord
        _tooltips?:                             object;
    }

    interface DataLayerStruct {
        get(name: string): typeof DataLayer;
    }

    interface state {
        start:      number;
        end:        number;
    }

    interface LayoutsStruct {
        merge(layout: GeneLayerSettings, default_layout: GeneLayerSettings): GeneLayerSettings
    }

    export const DataLayers: DataLayerStruct;
    export const Layouts: LayoutsStruct;
    export const Adapters: Registry;
    export function populate(selector: string,
        datasource: DataSources,
        layout: object): Plot

}

declare type config = {
    cache_enabled: boolean;
    cache_size: number;
    url: string;
    prefix_namespace: boolean;
    limit_fields: null | Array<string>;
}

declare interface GeneTrackRecord extends GeneAnnotationRecord {
    display_range:      GeneDisplay;
    display_domain:     GeneDisplay;
    track:              number;
    parent:             any;
}