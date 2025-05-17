
export function significance(val: number): LineLayer {
    return {
        id: 'significance',
        type: 'orthogonal_line',
        orientation: 'horizontal',
        offset: val
    };
}