

function resetSelectorOptions(selectId) {
    tmp = document.getElementById(selectId);
    n = tmp.childNodes.length;
    to_remove = [];
    for (i = 0; i < n; i++) {
        if (tmp.childNodes[i].nodeName != "OPTION") {
            continue;
        }
        if (tmp.childNodes[i].id === "") {
            continue;
        }
        to_remove.push(tmp.childNodes[i]);
    }

    n = to_remove.length;
    for (i=0; i < n; i++)
        tmp.removeChild(to_remove[i]);
}

function getPhenotypeFromQuery(url, htmlIdForProjectId) {

    return function g(queryElements) {
        const options = new URLSearchParams();

        options.append(htmlIdForProjectId,
            queryElements.get(htmlIdForProjectId).value);

        resetSelectorOptions("chr") 
        resetSelectorOptions("phenotype")

        fetch(`${url}?${options}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("HTTP request error");
                }
                return response.json()
            })
            .then((text) => {
                if (text.length == 0) {
                    return
                }

                for (i = 0; i < text.length; i++) {
                    tmp = document.createElement("option")
                    tmp.setAttribute("id", text[i])
                    tmp.text = text[i]
                    queryElements.get("phenotype").appendChild(tmp)
                }
            })
    }
}

function getChrFromQuery(url, htmlIdForProjectId, htmlIdForPhenotype) {

    return function g(queryElements) {
        const options = new URLSearchParams();

        options.append(htmlIdForProjectId,
            queryElements.get(htmlIdForProjectId).value);
        options.append(htmlIdForPhenotype,
            queryElements.get(htmlIdForPhenotype).value);

        resetSelectorOptions("chr");

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