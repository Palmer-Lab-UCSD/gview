
interface ApiRequestBase {
    projectId:          string;
    phenotype:          string;
    chr:                string;
    build?:             string;
    get(name: string): string;
}

declare type ApiRequestPositions = ApiRequestBase

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