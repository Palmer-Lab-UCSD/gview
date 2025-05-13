
declare class ApiRequestOptionsPlots extends URLSearchParams {
    build:              string;
    projectId:          string;
    phenotype:          string;
    chr:                string;
    halfRegionSize?:    string;
    start?:             number;
    end?:               number;
}

declare interface ChrInfoPlots {
    Start:      number;
    End:        number;
    Length:     number;
}


declare class QueryElements extends Map<string, DataHtmlSelectElement> {}

declare interface DataHtmlSelectElement extends HTMLSelectElement {
    eventProcessor: (queryElements: QueryElements) => void;
}

