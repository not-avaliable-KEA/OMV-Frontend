import config from "../../../js/config.js";

const url = config.url + "work"
let works;

export default async function workInit(){
    // if logged in enable create button, if not disable
    const createButton = document.getElementById("create-button");
    if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "") && 
    (sessionStorage.getItem("userId")   != null && sessionStorage.getItem("userId") > 0)) {
       createButton.hidden = false;
    } else {
        createButton.hidden = true;
    }

    // get the works
    let response = await fetch(url)
    works = Array.from(await response.json());

    // prep container
    let container = document.getElementById("works");
    container.innerHTML = "";

    // add each work
    works.forEach((work) => {
        // make new div for work
        let div = document.createElement("div");
        
        // set id
        div.id = `id-${work.id}`;

        // add html and info
        div.innerHTML = 
            `<div class="overlay">
                <img class="image-work rounded" src="${work.image}">
            </div>
            <div class="text-overlay-work">
                                Artist: ${work.artist}<br>
                                Release: ${work.releaseName}<br> 
                                Release date: ${work.releaseDate}<br>
                                Credit: ${work.credit}<br>
                                Commentary: ${work.commentary}</div>`;

        // add the classes to the div
        div.classList.add("image-container");
        div.classList.add("col-lg-3");
        div.classList.add("col-md-4");
        div.classList.add("col-sm-6");
        div.classList.add("col-xs-12");

        // add to the container
        container.appendChild(div);
    });
}