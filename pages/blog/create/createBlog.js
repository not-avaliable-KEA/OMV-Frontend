import config from "../../../js/config.js"
import { fileLoad } from "../../../js/utils.js";
const url = config.url + "blogpost"

export default async function initCreateBlog() {
    document.getElementById("submit-button").addEventListener("click", (event) => createBlog(event));
    document.getElementById("picture").addEventListener("input", () => loadAndPreviewFile())
}

async function createBlog(event) {
    event.preventDefault()
    
    //picture = loadFile(document.getElementById("picture").value)

    let data = {
        title: document.getElementById("title").value, 
        text: document.getElementById("text").value,
        picture: fileAsBase64,
        createdDate: new Date(Date.now())
                                  .toISOString()
                                  .replace("T", " ")
                                  .substring(0, 16)
    }

    console.log(fileAsBase64);

    fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
    })
}

// to load the image when the input field updates
let fileAsBase64 = "";
async function loadAndPreviewFile() {
    
    fileLoad("#picture", (file) => {
        fileAsBase64 = file;
        document.querySelector('#imagePreview').src = file
    });
}