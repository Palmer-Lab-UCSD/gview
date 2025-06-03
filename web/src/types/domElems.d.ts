

declare class QueryElements extends Map<string, DataHtmlSelectElement> {}

declare interface DataHtmlSelectElement extends HTMLSelectElement {
    eventProcessor: (queryElements: QueryElements) => void;
}

type UiState = Array<LocusZoom.Plot>;