declare namespace d3 {

    interface BBoxElement {
        width:  number;
    }


    export interface Node extends Element {
        getBBox():  BBoxElement;
    }


    /** 
     * Claude, the AI assistant by Anthropic helped me define the
     * interface representing the class d3.Selection.  Specifically,
     * I needed help in finding the complete set of properties and 
     * methods.  Second I needed help on the input and return types.
     */
    export interface Selection {
        select(select: (() => string) | string):    Selection;
        selectAll(selector: string):                Selection;
        filter(filter: string, value: string | number | ((d: any) => any)):   Selection;

        // Data binding
        data<T>(data: Array<T>, fn: (d: T) => string):  Selection;
        enter():                                        Selection;
        exit():                                         Selection;
        merge(val: Selection):                          Selection;

        // DOM manipulation
        append(name: string):                           Selection;
        remove():                                       Selection;
    
        // Attributes and properties
        attr(name: string, value: any | ((d: any, i: number) => any)): Selection;
        style(name: string, value: any | ((d: any, i: number) => any), priority?: string): Selection;
        text(value: string | ((d: any, i: number) => string)): Selection;
        html(value: string | ((d: any, i: number) => string)): Selection;
    
        // Events
        on(typenames: string, callback: (event: Event, d: any) => void): Selection;
    
        // Utilities
        each(callback: (d: any, i: number, nodes: Element[]) => void): Selection;
        node(): Node;
        nodes(): Array<Node>;
        size(): number;
    }

    export function select(name: SVGGElement | SVGElement | Selection): Selection;
}