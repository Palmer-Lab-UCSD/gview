
declare interface ApiRequestOptionsPlots extends URLSearchParams {
    projectId:          string;
    phenotype:          string;
    chr:                string;
    build?:             string;
}

declare interface ApiRequestAssoc extends ApiRequestOptionsPlots {
    start:             number;
    end:               number;
}

declare interface ApiRequestChr extends ApiRequestOptionsPlots {}

declare interface ApiRequestGene {
    chr:        string;
    start:      number;
    end:        number;
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

