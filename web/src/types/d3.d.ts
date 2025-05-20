declare namespace d3 {

    interface BBoxElement {
        width:  number;
        height: number;
        y:  number;
    }

    // d3 extends SVG element 
    export interface SVGGraphicsElement extends SVGElement {
        getBBox(): BBoxElement;
    }

    export interface Node<T> {
        data: T;
        parent: Node<T>;
        children:   Array<Node<T>>;
        depth:  number;
        height: number;
        value?:  any;
    }

    /** 
     * Claude, the AI assistant by Anthropic helped me define the
     * interface representing the class d3.Selection.  Specifically,
     * I needed help in finding the complete set of properties and 
     * methods.  Second I needed help on the input and return types.
     */
    export interface Selection<GElement extends Element = Element, Datum = any> {

        // d3.Selection specifications
        select<NewGElement extends Element, 
            NewDatum>(selector: string):    Selection<NewGElement, NewDatum>;
        
        // I the return selection has datum = any because different elements may
        // with the same SVG element may have different data types
        selectAll<NewGElement extends Element,
            NewDatum>(selector: string):    Selection<NewGElement, NewDatum>;
        filter(filter: string,
            value: string 
            | number 
            | ((d: any) => any)):           Selection<GElement, Datum>;


        // DOM manipulation, consquently, makes a new d3.Selection 
        // The second argument is the key function.  Provides reference by key name.
        data<Datum>(data: Array<Datum>,
            key: (d: Datum, i: number, nodes: Array<Node<Datum>>) => string):   Selection<GElement, Datum>;

        merge(val: Selection):                  Selection<Element, any>;

        enter():                        Selection<GElement, Datum>;
        exit():                         Selection<GElement, Datum>;

        append(name: string):          Selection<GElement, Datum>;
        remove():                      Selection<GElement, Datum>;
    
        // Manipulate DOM element properties, and not the DOM itself.  This is
        // returned to facilitate chaining
        attr(name: string, 
            value?: any | ((d: any, i: number) => any)):        this;
        style(name: string,
            value: any | ((d: any, i: number) => any),
            priority?: string):                                 this;
        text(value: string | ((d: any, i: number) => string)):  this;
        html(value: string | ((d: any, i: number) => string)):  this;
        each(callback: 
            (d: any, i: number, nodes: GElement) => void):      this;
    
        // Events
        on(typenames: string,
            callback: 
            (d: any, event?: Event | undefined) => void):       Selection;
        call(value: any):                                       Selection;
    

        node():                                                 Node<Datum>;
        nodes():                                                Array<Node<Datum>>;
        size():                                                 number;
    }

    export function select(name: SVGGElement 
        | SVGElement 
        | Selection 
        | string):                                              Selection;
}