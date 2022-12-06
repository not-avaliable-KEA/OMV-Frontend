import config from "../../../../js/config.js";
const url = config.url + "liveVideo";

export default function initCreateLiveVideo(id) {
    reset();

    if (id != null && id > 0) {
        setupUpdate(id);
    }
}

async function createLiveVideo(event) {
    event.preventDefault();

    // get values
    let createPackage = {
        title: document.getElementById("title").value,
        date: document.getElementById("date").value,
        intro: document.getElementById("intro").value,
        url: document.getElementById("url").value,
    };

    // check for required fields, and return if it does not contain one or more of them
    let title = checkInput("title")
    let date  = checkInput("date")
    let videoUrl   = checkInput("url")
    if (title || date || videoUrl) return

    console.log(url);
    
    // post and check
    let response = await fetch(url, {
        method: 'POST', 
        credentials: "include" ,
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(createPackage)});
    
    if (response.ok) {
        reset();
        window.location = "#/blog"
    } else {
        console.log(response);
        throw new Error("Could not send the info to the database");
    }
}

async function updateLiveVideo(event, id) {
    event.preventDefault();

    // get values
    let updatePackage = {
        title: document.getElementById("title").value,
        date: document.getElementById("date").value,
        intro: document.getElementById("intro").value,
        url: document.getElementById("url").value,
    };

    // patch and check
    let response = await fetch(url + "/" + id, {
        method: "PATCH",
        credentials: "include",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(updatePackage)
    });
    
    if (response.ok) {
        reset();
        window.location = "#/blog"
    } else {
        console.log(response);
        throw new Error("Could not send the info to the database");
    }
}

let toBeUpdated;
async function setupUpdate(id) {
    let submitButton = document.getElementById("create-button");
    submitButton.replaceWith(submitButton.cloneNode(true));
    document.getElementById("create-button").addEventListener("click", (event) => updateLiveVideo(event, id));

    document.getElementById("heading").innerText = "Update LiveVideo";
    document.getElementById("create-button").innerText = "Update";

    let response = await fetch(url + "/" + id, {
        method: "GET",
        credentials: "include",
        headers: {'Content-Type': 'application/json'}
    });
    toBeUpdated = await response.json();

    document.getElementById("title").value = toBeUpdated.title;
    document.getElementById("date").value = toBeUpdated.date;
    document.getElementById("intro").value = toBeUpdated.intro;
    document.getElementById("url").value = toBeUpdated.url;

    loadAndPreviewThumbnail();
}


function loadAndPreviewThumbnail() {
    let url = document.getElementById("url").value.match(/watch\?v=([^\/?]+)/)[1]
    document.getElementById("preview").src = `https://img.youtube.com/vi/${url}/hqdefault.jpg`
}

function reset() {
    let submitButton = document.getElementById("create-button");
    submitButton.replaceWith(submitButton.cloneNode(true));
    document.getElementById("create-button").addEventListener("click", (event) => createLiveVideo(event));
    document.getElementById("url").addEventListener("input", () => loadAndPreviewThumbnail());

    clearInput(["title", "date", "intro", "url"]);

    document.getElementById("heading").innerText = "Create LiveVideo";
    document.getElementById("create-button").innerText = "Create";
}

function clearInput(list) {
    list.forEach(elem => {
        document.getElementById(elem).value = "";
        document.getElementById(elem).classList.remove("is-valid");
        document.getElementById(elem).classList.remove("is-invalid");
    });
}

function checkInput(elementID) {
    if (document.getElementById(elementID).value === "") {
        document.getElementById(elementID).classList.add("is-invalid");
        return true
    } else {
        document.getElementById(elementID).classList.add("is-valid");
        document.getElementById(elementID).classList.remove("is-invalid");
        return false
    }
}