const url = "http://127.0.0.1:8080/api/v1/user/login";
var attempt = 3; // Variable to count number of attempts.

async function validateLogin(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (await loginValidation(username, password) === true){
        console.log(sessionStorage.getItem("username"))
        console.log(sessionStorage.getItem("userId"))
        window.location = "#/"; // Needs to redirect to admin page.
        
    } else {
        attempt --;// Decrementing by one.
       // alert("Du har nu "+attempt+" forsøg tilbage;");
        // Disabling fields after 3 attempts.
        if( attempt == 0){
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("submit").disabled = true;
            return false;
        }
    }

    async function loginValidation(username, password){
        const values = {
            "username": username,
            "password": password
        }

        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
    
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        
        
        let data
        try {
           data=await response.json();
           sessionStorage.setItem("username", data.username)
           sessionStorage.setItem("userId", data.id)
           return true;
        } catch (error) {
            return false;
        }
    }
}

export function init() {
    console.log("init");
    document.getElementById("submit").addEventListener("click", () => validateLogin())
}

