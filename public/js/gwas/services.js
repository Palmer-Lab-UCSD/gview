/** Manage data source queries from selectors
 * 
 * 2025, Palmer Lab at UCSD
 * 
 */


/** Reset HTML selector options
 * 
 * @param {String} selectId is the HTML tag id where options
 * will be reset to a single default value.
 */
function resetSelectorOptions(selectId) {
    tmp = document.getElementById(selectId);
    n = tmp.childNodes.length;
    toRemove = [];
    for (i = 0; i < n; i++) {
        if (tmp.childNodes[i].nodeName !== "OPTION") {
            continue;
        }
        if (tmp.childNodes[i].id === "") {
            continue;
        }
        toRemove.push(tmp.childNodes[i]);
    }
    n = toRemove.length;
    for (i=0; i < n; i++)
        tmp.removeChild(toRemove[i]);
}


/** Return closure for selector event processing
 * 
 * @param {String} url for fetch request
 * @param {Array} ancestorsHtmlIds, 
 * @param {String} thisHtmlId is that with which the options will be updated
 * @param {Array} descendentsHtmlId are those that require thisHtmlId and
 * ancestorsHtmlIds for specificication
 * @returns {function} closure for performing request
 */
function queryDataSourcesFromSelectors(url,
    ancestorsHtmlIds,
    thisHtmlId,
    descendentsHtmlIds) {

    return function g(queryElements) {
        const options = new URLSearchParams();

        for (i=0; i < ancestorsHtmlIds.length; i++) {
            options.append(ancestorsHtmlIds[i],
                queryElements.get(ancestorsHtmlIds[i]).value);
        }
        options.append(htmlIdForProjectId,
            queryElements.get(htmlIdForProjectId).value);
        options.append(htmlIdForPhenotype,
            queryElements.get(htmlIdForPhenotype).value);

        resetSelectorOptions(thisHtmlId);
        for (i = 0; i < descendentsHtmlIds.length; i++) {
            resetSelectorOptions(descendentsHtmlIds[i])
        }

        fetch(`${url}?${options}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("HTTP request error");
                }

                return response.json()
            })
            .then((text) => {
                for (i = 0; i < text.length; i++) {
                    tmp = document.createElement("option");
                    tmp.setAttribute("id", text[i]);
                    tmp.text = text[i];
                    queryElements.get("chr").appendChild(tmp);
                }
            })
    }
}


function createListeners(queryElements) {

    values = new Map();

    for (key of queryElements.keys()) {

        queryElements.get(key).addEventListener("change", (event) => {
            if (event.target.value === "") {
                return
            }
            event.target.eventProcessor(queryElements)
        });
    }
}

export {
    queryDataSourcesFromSelectors,
    createListeners
}