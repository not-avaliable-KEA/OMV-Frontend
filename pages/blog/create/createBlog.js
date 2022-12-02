import config from "../../../js/config.js"
import { fileLoad } from "../../../js/utils.js";

let url = config.url + "blogpost";
let method = "POST";

export default async function initCreateBlog(id) {
    if (id != null && id > 0) {
        method = "PATCH"
        document.getElementById('submit-button').innerText = "Update Blog"
        setblogData(id);
        url += "/" + id
    } else {
        resetCreate();
    }

    document.getElementById("submit-button").addEventListener("click", (event) => createBlog(event));
    document.getElementById("picture").addEventListener("input", () => loadAndPreviewFile())
}

async function createBlog(event) {
    event.preventDefault()

    let data = {
        title:       document.getElementById("title").value, 
        text:        document.getElementById("text").value,
        picture:     fileAsBase64,
        createdDate: new Date(Date.now())
                                  .toISOString()
                                  .replace("T", " ")
                                  .substring(0, 16)
    }

    let response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
    });
    

    if (await response.ok) {
        resetCreate();

        window.location = "#/blog"
    } else {
        throw new Error("Could not send the info to the database");
    }
}

// function to helo edit to set values from the blog, based on id
async function setblogData(id) {

    let response = await fetch(url + "/" + id)
    let blogPost = await response.json();

    document.getElementById("title").value = blogPost.title;
    document.getElementById("text").value = blogPost.text;
    document.getElementById("picture").value = "";
    document.getElementById('imagePreview').src = blogPost.picture;

    document.getElementById('submit-button').innerText = "Update Blog"
    document.getElementById('header').innerText = "Update blogpost"
}

// to load the image when the input field updates
let fileAsBase64 = "";
async function loadAndPreviewFile() {

    fileLoad("#picture", (file) => {
        fileAsBase64 = file;
        document.querySelector('#imagePreview').src = file
    });
}

// resets the create page to default
function resetCreate() {
    document.getElementById("title").value = "";
    document.getElementById("text").value = "";
    document.getElementById("picture").value = "";
    document.getElementById('imagePreview').src = "";

    document.getElementById('submit-button').innerText = "Create Blog"
    document.getElementById('header').innerText = "Create new blogpost"
    method = 'POST';
    url = config.url + "blogpost";
}