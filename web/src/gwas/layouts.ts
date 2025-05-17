/**
 * 2025, Palmer Lab at UCSD
 * 
 * Recall that in locus zoom a layout is an object, it contains the global
 * settings of a figure, and the list of panels.  Each panel is a plot, and
 * specifies plot level settings.  Each panel has a data_layer which defines
 * the data expected and how to plot it. 
 */

const HEIGHT = 300;
const WIDTH = 900;
const HEIGHT_CHR_OVERVIEW = 150;

/** Construct layout to be used for association plots
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
function locusAssoc(state: AssocState,
    panels: Array<PanelAssoc | PanelGene>) {
    return {
        height: HEIGHT,
        width: WIDTH,
        state: state,
        responsive_resize: true,
        panels: panels
    };
}


function chrAssoc(state: ChrState,
    panels: Array<PanelAssoc>) {
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