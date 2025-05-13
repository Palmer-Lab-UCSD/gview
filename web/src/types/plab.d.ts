
declare class QueryElements extends Map<string, DataHtmlSelectElement> {}

declare interface DataHtmlSelectElement extends HTMLSelectElement {
    eventProcessor: (queryElements: QueryElements) => void;
}


interface ApiRequestBase {
    projectId:          string;
    phenotype:          string;
    chr:                string;
    build?:             string;
}

interface ApiRequestAssoc extends ApiRequestBase {
    start:             number;
    end:               number;
}

interface ApiRequestChr extends ApiRequestBase {}

interface ApiRequestGene {
    chr:        string;
    start:      number;
    end:        number;
}

interface ChrInfoPlots {
    start:      number;
    end:        number;
    length:     number;
}