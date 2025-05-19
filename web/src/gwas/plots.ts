/**
 * 2025, Palmer Lab at UCSD
 */
import { PlabApiAdapters } from "../data_sources/index.js";
import { PlabPanels } from "../panels/index.js";
import { PlabDataLayers } from "../data_layer/index.js";
import  * as PlabLayouts from "./layouts.js";
import { ui } from "./state.js";


const URLS = {
    GET_INIT_POS: '/api/gwas/initPos',
    GET_CHR_OVERVIEW: '/api/gwas/chrOverview',
    GET_ASSOC_DATA: '/api/gwas/loci',
    GET_GENE_DATA: '/api/gwas/gene',
    GET_CHROM_POS: '/api/gwas/chrStats'
};


// TODO Add real statistical significance value instead of setting sigVal
const BUILD: string = 'mRatBN7.2';
const HALF_REGION_SIZE: number = 500000;
const SIG_VAL: number = 5;


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
async function makeChrPlot(options: URLSearchParams,
    chrInfo: ChrInfoPlots,
    htmlIdForPlot: string): Promise<void> {

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
    }

    if (state.projectId === null 
        || state.phenotype === null
        || state.chr === null)
        throw new Error("Invalid parameters");

    const layout = PlabLayouts.chrAssoc(state as ChrState,
        [
            PlabPanels.chrAssoc(dataNamespace,
                state.chr, "Pos", "NegLogPval")
        ]
    );

    ui.push(LocusZoom.populate(`#${htmlIdForPlot}`,
        data_sources,
        layout));
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
async function makeLocusPlot(options: URLSearchParams,
    sigVal: number,
    htmlIdForPlot: string): Promise<void> {

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
    }

    if (state.projectId === null 
        || state.phenotype === null
        || state.chr === null
        || state.start === null 
        || state.end === null)
        throw new Error("Invalid parameters");

    const layout = PlabLayouts.locusAssoc(state as AssocState, 
        [
            PlabPanels.locusAssoc("assoc",
                state.chr, 
                "Pos",
                "NegLogPval",
                sigVal),
            PlabPanels.geneTracks([PlabDataLayers.gene("gene")])
        ]
    );

    ui.push(LocusZoom.populate(`#${htmlIdForPlot}`,
        data_sources,
        layout));


    // plot.on("region_changed",
    //     (event) => {
    //         console.log('LZplot event: ', event)
    // });
}


async function getInitPositions(options: URLSearchParams): Promise<Array<number>> {
    const response = await fetch(`${URLS.GET_INIT_POS}?${options}`);
    if (!response.ok) {
        throw new Error("Couldn't get initial position")
    }
    // remember that response.json() returns a promise
    const tmp = response.json();
    console.log(tmp);
    return tmp
}

async function getChrInfo(options: URLSearchParams): Promise<ChrInfoPlots> {
    const response: Response = await fetch(`${URLS.GET_CHROM_POS}?${options}`);

    if (!response.ok) {
        throw new Error("Couldn't get chromosome position")
    }
    // remember that response.json() returns a promise
    return response.json();
}


/**
 * Instantiate association plots and gene tracks
 * 
 * @param {string} htmlIdForProjectId 
 * @param {string} htmlIdForPhenotype 
 * @param {string} htmlIdForChr 
 * @param {object} htmlIdsForPlots 
 * @returns (QueryElements) => Promise<void>
 */
function initAll(htmlIdForProjectId: string,
        htmlIdForPhenotype: string,
        htmlIdForChr: string,
        htmlIdsForPlots: { 
            chrOverview: string,
            locusOfInterest: string
        }): (queryElements: QueryElements) => Promise<void> {

    return async function g(queryElements: QueryElements): Promise<void> {

        const options = new URLSearchParams();
        options.append("build", BUILD)

        let tmp = queryElements.get(htmlIdForProjectId) as DataHtmlSelectElement | undefined;

        if (tmp === undefined)
            throw new Error("no projectId")
        options.append("projectId", tmp.value);

        tmp = queryElements.get(htmlIdForPhenotype);
        if (tmp === undefined) 
            throw new Error("no phenotype");
        options.append("phenotype",tmp.value);

        tmp = queryElements.get(htmlIdForChr);
        if (tmp === undefined) 
            throw new Error("no chr");
        options.append("chr", tmp.value);


        // Construct overview plot
        const chrStats: ChrInfoPlots = await getChrInfo(options);
        makeChrPlot(options,
            chrStats,
            htmlIdsForPlots.chrOverview);

        options.append("halfRegionSize", HALF_REGION_SIZE.toString());

        // Construct fine-scale plot
        const output: Array<number> = await getInitPositions(options)

        console.log("output posits", output)
        options.append('start', output[0].toString());
        options.append('end', output[1].toString());

        // TODO need to query sigVal from database
        makeLocusPlot(options, SIG_VAL, htmlIdsForPlots.locusOfInterest);
    }
}


export {
    makeChrPlot,
    makeLocusPlot, 
    initAll
}