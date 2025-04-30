
function sign_in(email, password) {

    let login_credentials = {
        email: document.getElementById(email).value.trim(),
        password: document.getElementById(password).value.trim()
    };

    console.log(JSON.stringify(login_credentials))

    fetch("/login", {
            method: "POST",
            body: JSON.stringify(login_credentials),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP request error");
            }
            return response.text()
        })
        .then((text) => {
            console.log(text)
        })
}

function create_account() {
    fetch("/accounts", {
        method: "GET"
    })
    .then((response) => {})
}
