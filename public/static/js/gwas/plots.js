/**
 * 2025, Palmer Lab at UCSD
 */
import * as PlabApiAdapters from "./adapters.js";
import * as PlabPanels from "./panels.js";
import * as PlabLayouts from "./layouts.js";
import { ui } from "./state.js";
const URLS = {
    GET_INIT_POS: '/api/gwas/initPos',
    GET_CHR_OVERVIEW: '/api/gwas/chrOverview',
    GET_ASSOC_DATA: '/api/gwas/loci',
    GET_GENE_DATA: '/api/gwas/gene',
    GET_CHROM_POS: '/api/gwas/chrStats'
};
// TODO Add real statistical significance value instead of setting sigVal
const BUILD = 'mRatBN7.2';
const HALF_REGION_SIZE = 500000;
const SIG_VAL = 5;
/**
 * Plot association data along entire chromosome.
 *
 * As there are many associations per chromosome, I down sample the loci as
 * follows.  I create position bins along the chromosome length.  Each bin
 * is expected to bound many loci, among these I choose the locus with the
 * highest -log10(pval).
 *
 * @param {Object} options, contains, at a minimum, the following information:
 *  - {String} projectId
 *  - {String} phenotype
 *  - {String} chr
 * @param {Object} chrInfo, contains, at a minimum, the following chromosome
 * specific information:
 *  - {int} Start, smallest position, in units of base pairs, in which there
 *      is an association statistic
 *  - {int} End, largest position, in unites of base pairs, in which there is
 *      an association statistic
 *  - {int} Length, Start - End
 * @param {String} htmlIdForPlot
 */
async function makeChrPlot(options, chrInfo, htmlIdForPlot) {
    const dataNamespace = "assocOverview";
    const chrOverviewAdapter = new PlabApiAdapters.ChrSubsetAdapter({
        url: URLS.GET_CHR_OVERVIEW
    });
    const data_sources = new LocusZoom.DataSources()
        .add(dataNamespace, chrOverviewAdapter);
    const state = {
        projectId: options.get("projectId"),
        phenotype: options.get("phenotype"),
        chr: options.get("chr"),
        start: chrInfo.start,
        end: chrInfo.end
    };
    if (state.projectId === null
        || state.phenotype === null
        || state.chr === null)
        throw new Error("Invalid parameters");
    const layout = PlabLayouts.chrAssoc(state, [
        PlabPanels.chrAssoc(dataNamespace, state.chr, "Pos", "NegLogPval")
    ]);
    ui.push(LocusZoom.populate(`#${htmlIdForPlot}`, data_sources, layout));
}
/**
 * Locus of interest plot
 *
 * Here we display the association statistics and gene tracks for a small
 * region of a chromosome.  This will facilitate detailed analyses by
 * researcher.
 *
 *  @param {string} url to api service
 *  @param {ScatterPlotState} state as defined by locuszoom.js, required fields:
 *      - build: String (mRatBN7.2)
 *      - projectId: String
 *      - phenotype: String
 *      - chr: string
 *      - start: positive int
 *      - end: positive int
 *  @param {string} id of html tag in which the figure is placed.
*/
async function makeLocusPlot(options, sigVal, htmlIdForPlot) {
    const assocAdapter = new PlabApiAdapters.AssocAdapter({
        url: URLS.GET_ASSOC_DATA
    });
    const geneAdapter = new PlabApiAdapters.GeneAdapter({
        url: URLS.GET_GENE_DATA,
    });
    const data_sources = new LocusZoom.DataSources()
        .add("assoc", assocAdapter)
        .add("gene", geneAdapter);
    const state = {
        projectId: options.get("projectId"),
        phenotype: options.get("phenotype"),
        chr: options.get("chr"),
        start: options.get("start"),
        end: options.get("end")
    };
    if (state.projectId === null
        || state.phenotype === null
        || state.chr === null
        || state.start === null
        || state.end === null)
        throw new Error("Invalid parameters");
    const layout = PlabLayouts.locusAssoc(state, [
        PlabPanels.locusAssoc("assoc", state.chr, "Pos", "NegLogPval", sigVal),
        PlabPanels.genes("gene")
    ]);
    ui.push(LocusZoom.populate(`#${htmlIdForPlot}`, data_sources, layout));
    // plot.on("region_changed",
    //     (event) => {
    //         console.log('LZplot event: ', event)
    // });
}
async function getInitPositions(options) {
    const response = await fetch(`${URLS.GET_INIT_POS}?${options}`);
    if (!response.ok) {
        throw new Error("Couldn't get initial position");
    }
    // remember that response.json() returns a promise
    const tmp = response.json();
    console.log(tmp);
    return tmp;
}
async function getChrInfo(options) {
    const response = await fetch(`${URLS.GET_CHROM_POS}?${options}`);
    if (!response.ok) {
        throw new Error("Couldn't get chromosome position");
    }
    // remember that response.json() returns a promise
    return response.json();
}
function initAll(htmlIdForProjectId, htmlIdForPhenotype, htmlIdForChr, htmlIdsForPlots) {
    return async function g(queryElements) {
        const options = new URLSearchParams();
        options.append("build", BUILD);
        let tmp = queryElements.get(htmlIdForProjectId);
        if (tmp === undefined)
            throw new Error("no projectId");
        options.append("projectId", tmp.value);
        tmp = queryElements.get(htmlIdForPhenotype);
        if (tmp === undefined)
            throw new Error("no phenotype");
        options.append("phenotype", tmp.value);
        tmp = queryElements.get(htmlIdForChr);
        if (tmp === undefined)
            throw new Error("no chr");
        options.append("chr", tmp.value);
        // Construct overview plot
        const chrStats = await getChrInfo(options);
        makeChrPlot(options, chrStats, htmlIdsForPlots.chrOverview);
        options.append("halfRegionSize", HALF_REGION_SIZE.toString());
        // Construct fine-scale plot
        const output = await getInitPositions(options);
        console.log("output posits", output);
        options.append('start', output[0].toString());
        options.append('end', output[1].toString());
        // TODO need to query sigVal from database
        makeLocusPlot(options, SIG_VAL, htmlIdsForPlots.locusOfInterest);
    };
}
export { makeChrPlot, makeLocusPlot, initAll };
