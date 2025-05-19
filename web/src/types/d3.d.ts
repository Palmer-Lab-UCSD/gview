declare namespace d3 {

    interface BBoxElement {
        width:  number;
        height: number;
        y:  number;
    }

    export interface node extends Element {
        data: any;
        depth:  number;
        height: number;
        parent: node;
        children:   Array<node>;
        value?:  any;

        each(callback: (d: node, i: number, nodes: Array<node>) => void): node;
        getBBox():  BBoxElement;
    }

    /** 
     * Claude, the AI assistant by Anthropic helped me define the
     * interface representing the class d3.Selection.  Specifically,
     * I needed help in finding the complete set of properties and 
     * methods.  Second I needed help on the input and return types.
     */
    export interface Selection {
        select(this: node, select: string | node):              Selection;
        selectAll(selector: string | node | Array<node>):       Selection;
        filter(filter: string,
            value: string 
            | number 
            | ((d: any) => any)):                               Selection;

        // Data binding
        data<T>(data: Array<T>,
            fn: (d: T) => string):                              Selection;
        merge(val: Selection):                                  Selection;

        enter():                                                Selection;
        exit():                                                 Selection;

        // DOM manipulation
        append(name: string):                                   Selection;
        remove():                                               Selection;
    
        // Attributes and properties
        attr(name: string, 
            value?: any | ((d: any, i: number) => any)):         Selection;
        style(name: string,
            value: any | ((d: any, i: number) => any),
            priority?: string):                                 Selection;
        text(value: string | ((d: any, i: number) => string)):  Selection;
        html(value: string | ((d: any, i: number) => string)):  Selection;
    
        // Events
        on(typenames: string,
            callback: 
            (d: any, event?: Event | undefined) => void):       Selection;
        call(value: any):                                       Selection;
    
        // Utilities
        each(callback: 
            (d: any, i: number, nodes: Element[]) => void):     Selection;
        node():                                                 node;
        nodes():                                                Array<node>;
        size():                                                 number;
    }

    export function select(name: SVGGElement 
        | SVGElement 
        | Selection 
        | string):                                              Selection;
}