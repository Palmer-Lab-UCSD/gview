
const signInButton: HTMLElement = document.querySelector("button#signInButton");

signInButton.addEventListener("click", (event: Event) => {

    const button: HTMLElement = event.target as HTMLElement;
    const parentForm: HTMLFormElement = button.parentElement as HTMLFormElement;

    if (parentForm?.tagName !== "FORM") {
        return;
    }
    const fdata = new FormData(parentForm);
    // Validate input
    const userEmail: string = fdata.get("email") as string;
    const userPassword: string = fdata.get("password") as string;
    
    // Construct the request
    const header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");

    const payload = new URLSearchParams({email: userEmail,
        password: userPassword})

    const req: Request = new Request("/api/auth", {
        headers: header,
        method: "POST",
        body: payload,
    })

    fetch(req)
    .then((res) => {
        console.log(res.headers.get("content-type"));
        if (!res.ok) {
            throw new Error(`Http error: ${res.status}`);
        } else if (res.headers.get("content-type") !== "application/json") {
            throw new TypeError("Response content-type incorrect")
        }
        return res.blob();
    })
    .then((res) => {
        console.log("here"); 
    });
})

