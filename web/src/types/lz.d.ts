
declare namespace LocusZoom {

    class Adapter {
        _url: string
        _getURL(request_options: any): string
        _normalizeResponse(response_text: string,
            options: any): JSON
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
        id:             null | string;
        height:         null | number;
        data_layers:    Array<number>;
    }

    interface Plot {}

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