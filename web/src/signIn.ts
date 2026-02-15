
const signInButton: HTMLElement = document.querySelector("button#signInButton");

signInButton.addEventListener("click", (event: Event) => {

    const button: HTMLElement = event.target as HTMLElement;
    const parentForm: HTMLFormElement = button.parentElement as HTMLFormElement;

    if (parentForm?.tagName !== "FORM") {
        return;
    }
    const fdata = new FormData(parentForm);
    // Validate input
    const userEmail: string = "cat";
    const userPassword: string = "dog";
    
    // Construct the request
    const header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");

    const payload = new URLSearchParams({email: userEmail,
        password: userPassword})

    const req: Request = new Request("/api/signIn", {
        headers: header,
        method: "POST",
        body: payload,
        mode: "same-origin",
        credentials: "same-origin"
    })

    fetch(req)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`Http error: ${res.status}`);
        } else if (res.headers.get("content-type") !== "application/json") {
            throw new TypeError("Response content-type incorrect")
        }
        return res.blob();
    })
    .then((response) => {
         
    });
})

