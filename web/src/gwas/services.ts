/** Data source queries from selectors
 * 
 * 2025, Palmer Lab at UCSD
 * 
 */

class QueryElements extends Map<string, DataHtmlSelectElement> {};

/** Reset HTML selector options
 * 
 * @param {String} selectId is the HTML tag id where options
 * will be reset to a single default value.
 */
function resetSelectorOptions(selectId: string): void {
    const tmp = document.getElementById(selectId) as HTMLSelectElement;

    if (tmp === null || tmp.children === null) {
        return;
    }
    const child_elems = tmp.children as HTMLOptionsCollection;
    let toRemove: Array<HTMLOptionElement> = [];

    for (let i = 0; i < child_elems.length; i++) {

        if (child_elems[i].value === "") {
            continue;
        }
        toRemove.push(child_elems[i]);
    }

    for (let i=0; i < toRemove.length; i++)
        tmp.removeChild(toRemove[i]);
}


/** Return closure for selector event processing
 * 
 * @param {string} url for fetch request
 * @param {Array[string]} ancestorsHtmlIds, 
 * @param {string} thisHtmlId is that with which the options will be updated
 * @param {Array[string]} descendentsHtmlIds are those that require thisHtmlId and
 * ancestorsHtmlIds for specificication.  The first element of the array is the
 * target element to be updated
 * @returns {function} closure for performing request
 */
function queryDataSourcesFromSelectors(url: string,
    ancestorsHtmlIds: Array<string>,
    thisHtmlId: string,
    descendentsHtmlIds: Array<string>): (queryElements: QueryElements) => void {

    function getOptionValue(htmlId: string, queryElements: QueryElements): string {

        if (!queryElements.has(htmlId)) {
            throw new Error("html Id does not a query element");
        }

        let selectElem: HTMLSelectElement | undefined = queryElements.get(htmlId);

        if (selectElem === undefined) {
            throw new Error("undefined select item")
        }

        return selectElem.value;
    }

    return function g(queryElements: QueryElements): void {

        const options = new URLSearchParams();

        for (let i=0; i < ancestorsHtmlIds.length; i++)
            options.append(ancestorsHtmlIds[i],
                getOptionValue(ancestorsHtmlIds[i], queryElements));

        options.append(thisHtmlId,
            getOptionValue(thisHtmlId, queryElements));

        for (let i = 0; i < descendentsHtmlIds.length; i++) {
            resetSelectorOptions(descendentsHtmlIds[i])
        }

        // remember that the first descendent is the target to update
        const targetSelect = queryElements.get(descendentsHtmlIds[0]) as HTMLSelectElement;

        fetch(`${url}?${options}`)
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error("HTTP request error");
                }

                return response.json()
            })
            .then((text: Array<string>) => {

                let tmp: HTMLOptionElement | undefined = undefined;

                for (let i = 0; i < text.length; i++) {
                    tmp = document.createElement("option");
                    tmp.setAttribute("id", text[i]);
                    tmp.text = text[i];
                    targetSelect.appendChild(tmp);
                }
            })
    }
}


function createListeners(queryElements: QueryElements): void {

    console.log("queryElements", queryElements);
    let tmp: DataHtmlSelectElement | undefined = undefined;

    for (const key of queryElements.keys()) {
        tmp = queryElements.get(key);

        if (tmp === undefined)
            continue;

        tmp.addEventListener("change", (event: Event): void => {
            if (event.target === null)
                return;

            const target = event.target as DataHtmlSelectElement;

            if (target.value === "") {
                return
            }

            target.eventProcessor(queryElements);
        });
    }
}

export {
    QueryElements,
    queryDataSourcesFromSelectors,
    createListeners
}