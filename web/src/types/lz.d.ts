
declare type config = {
    cache_enabled: boolean;
    cache_size: number;
    url: string;
    prefix_namespace: boolean;
    limit_fields: null | Array<string>;
}

declare namespace LocusZoom {
    export interface Plot {}
    export interface RegistryBase {}
    export class BaseAdapter {}
    export class DataSources {
        constructor(registry?: RegistryBase);
    }
    export function populate(selector: string, datasource: DataSources, layout: object): Plot

    // export interface Adapters {
    //     _getURL: () => string;
    //     get: (: string) => LocusZoom.Adapters.BaseLZAdapter
    // }
}