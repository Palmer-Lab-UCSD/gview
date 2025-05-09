/**
 * 2025, Palmer Lab at UCSD
 */

const HEIGHT = 300;
const WIDTH = 900;
const HEIGHT_CHR_OVERVIEW = 150;

/** Construct layout to be used for plotting
 *
 *  @param{Object} state Object is defined by: 
 *      {
 *          build:                      String
 *          projectId:                  String 
 *          phenotype:                  String
 *          chr: chromosome index       String
 *          start: Plot x minimum       Positive int
 *          end: Plot x maximum         Positive int
 *      }
 *  @param{Array} panels, an array of panel objects to be plotted
 */
function locusAssoc(state, panels) {
    return {
        height: HEIGHT,
        width: WIDTH,
        state: state,
        responsive_resize: true,
        panels: panels
    };
}


function chrAssoc(state, panels) {
    return {
        height: HEIGHT_CHR_OVERVIEW,
        width: WIDTH,
        state: state,
        responsive_resize: true,
        panels: panels
    };
}

export {
    locusAssoc,
    chrAssoc
}