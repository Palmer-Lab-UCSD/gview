
function chrOverview(dataNamespace: string,
    xfield: string,
    yfield: string): AssocDataLayer {

    return {
        namespace: { 'assocOverview': dataNamespace },
        id: 'chrOverviewAssoc',
        type: 'scatter',
        id_field: 'assocOverview:Pos',
        point_size: 10,
        color: [
            '#005493',
        ],
        x_axis: {
            field: `assocOverview:${xfield}`,
        },
        y_axis: {
            field: `assocOverview:${yfield}`,
            axis: 1,
            floor: 0,
            upper_buffer: 0.10,
            min_extent: [0, 10],
        }
    };
}


export { chrOverview }