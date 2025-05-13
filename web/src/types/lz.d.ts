declare class BaseAdapter {}

declare class BaseLZAdapter {
    constructor(config: object)
    _url: string
    _getURL(request_options: any): string
    _normalizeResponse(response_text: string,
        options: any): JSON
}

declare class RegistryBase {
    get(name: string): typeof BaseLZAdapter
}
declare class ClassRegistry extends RegistryBase {}

declare interface Plot {}
declare class MyDataSources {
    constructor(registry?: RegistryBase);
    add(namesapce: string,
        adapter: BaseLZAdapter,
        override?: boolean): MyDataSources;
}

declare namespace LocusZoom {
    export const DataSources: typeof MyDataSources
    export const Adapters: ClassRegistry
    export function populate(selector: string, datasource: DataSources, layout: object): Plot
    export type Panel = {
        id:             null | string 
        height:         
        data_layers: Array<number> 
    }
}

declare type config = {
    cache_enabled: boolean;
    cache_size: number;
    url: string;
    prefix_namespace: boolean;
    limit_fields: null | Array<string>;
}