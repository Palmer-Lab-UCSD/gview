
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
    }

    interface Plot {}

    interface BBox {
        width: number;
    }

    interface Node {
        getBBox(): BBox;
    }

    class SvgRecord {
        attr(key: string, val: string | number): this;
        style(key: string, val: string | number): SvgRecord;
        text(val: string): SvgRecord;

        node(): Node;
        remove(): void;
    }

    interface SvgGroup {
        append(name: string):                       SvgRecord;
        selectAll(name: string):                    SvgGroup;
        data(names: Array<GeneAnnotationRecord>, fn: (d: GeneAnnotationRecord) => string):   Array<string>;
    }


    interface PlotElements {
        group:      d3.selection;
        container:  d3.selection;
        clipRect:   d3.selection;
    }

    class DataLayer {
        constructor(layout: GeneLayerSettings, parent: Panel | null)
        parent:                                 Panel
        tracks:                                 number;
        gene_track_index:                       NumericKeyObj<any>;
        layout:                                 GeneLayerSettings;

        state:                                  state;
        svg:                                    PlotElements;
        data:                                   Array<Svg>;

        _applyFilters():                       Array<GeneAnnotationRecord>;
        getElementId(element: HTMLElement | d3.obj):     string;
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
