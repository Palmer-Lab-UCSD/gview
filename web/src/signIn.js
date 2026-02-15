var signInButton = document.querySelector("button#signInButton");
signInButton.addEventListener("click", function (event) {
    var button = event.target;
    var parentForm = button.parentElement;
    if ((parentForm === null || parentForm === void 0 ? void 0 : parentForm.tagName) !== "FORM") {
        return;
    }
    var fdata = new FormData(parentForm);
    // Validate input
    var userEmail = "cat";
    var userPassword = "dog";
    // Construct the request
    var header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");
    var payload = new URLSearchParams({ email: userEmail,
        password: userPassword });
    var req = new Request("/api/signIn", {
        headers: header,
        method: "POST",
        body: payload,
        mode: "same-origin",
        credentials: "same-origin"
    });
    fetch(req)
        .then(function (res) {
        if (!res.ok) {
            throw new Error("Http error: ".concat(res.status));
        }
        else if (res.headers.get("content-type") !== "application/json") {
            throw new TypeError("Response content-type incorrect");
        }
        return res.blob();
    })
        .then(function (response) {
    });
});
