
declare namespace LocusZoom {
    class BaseAdapter {};
    class RegistryBase {
        get(name: string): typeof BaseLZAdapter;
    };

    class ClassRegistry extends RegistryBase {};


    class BaseLZAdapter {
        constructor(config: object)
        _url: string
        _getURL(request_options: any): string
        _normalizeResponse(response_text: string,
            options: any): JSON
    };

    class DataSources {
        constructor(registry?: RegistryBase);
        add(namesapce: string,
            adapter: BaseLZAdapter,
            override?: boolean): DataSources;
    };
    class Adapters extends ClassRegistry {};

    function populate(selector: string, datasource: DataSources, layout: object): Plot
    type Panel = {
        id:             null | string;
        height:         null | number;
        data_layers:    Array<number>;
    };
    interface Plot {};
}

declare type config = {
    cache_enabled: boolean;
    cache_size: number;
    url: string;
    prefix_namespace: boolean;
    limit_fields: null | Array<string>;
}