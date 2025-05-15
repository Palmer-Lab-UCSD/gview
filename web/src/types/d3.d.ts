declare namespace d3 {

    interface BBoxElement {
        width:  number;
    }

    interface obj {
        id:                                         string;
        attr(name: string, val: string | number | ((d: any) => any)):   obj;
        style(name: string, val: string | number):  obj;
        text(val: string):                          obj;
        node():                                     obj;
        remove():                                   obj;
        getBBox():                                  BBoxElement;
        append(t: string):                          obj; // t is the html or svg type, e.g. 'g '
        merge(s: selection):                        obj;
        data(track_data: Array<GeneAnnotationRecord>, fn: (d: GeneAnnotationRecord) => string): selection;
        each(() => ):
    }

    interface selection {
        enter():                                    obj;
        select(select: (() => string) | string):    obj;
        selectAll(selector: string):                obj;
        append(name: string):                       obj;
    }
}