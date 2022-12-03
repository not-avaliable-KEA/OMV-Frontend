import { fileLoad } from "../../../js/utils.js"
import config from "../../../js/config.js";

const url = config.url + "work"

let covers = []

export default async function coversInit() {
    document.querySelector('#cover-image').addEventListener("change", () => fileLoad('#cover-image', (file) => {imageFile = file;}))
    
    getCovers();

    reset();
}

/**
 * Responsible for getting user data from the database
 */
async function getCovers() {
    let response = await fetch(url)
    covers = Array.from(await response.json());
    displayCovers();
}

/**
 * Displays the user data in the table
 */
function displayCovers() {
    let tableBody = document.getElementById("cover-body")
    tableBody.innerHTML = "";

    covers.forEach(cover => {
        let elem = document.createElement("tr");
        elem.id = `cover${cover.id}`;

        let releaseDate = new Date(cover.releaseDate);
        let options = {year: 'numeric', month: 'long', day: 'numeric'}

        elem.innerHTML = (`
        <td class="col-2"><img class="image rounded-0" src="${cover.image}"></td>
        <td class="col-2">${cover.artistName}</td>
        <td class="col-2">${cover.singleName}</td>
        <td class="col-2">${releaseDate.toLocaleDateString(undefined, options)}</td>
        <td class="col-2">
            <button id="edit" class="btn btn-info" >edit</button> 
            <button id="delete" class="btn btn-danger" >delete</button>
        </td>`)


        elem.querySelector("#edit").addEventListener("click", () => edit(cover.id))
        elem.querySelector("#delete").addEventListener("click", () => deleteCover(cover.id))
    
        tableBody.appendChild(elem);
    });
}

/**
 * Swaps the text fields for input fields and changes buttons for save, cancel and delete
 */
function edit(id) {
    /**
     *  get cover 
     * == testing - filter returns item if each item matches the condtions. 
     *  returns a lists thats sorted from where cover.id is equal with the id parameter that the method is given. 
     *  then we pull out index 0 - since we dont expect there to be any other items in the list.
    */

     const cover = covers.filter((cover) => cover.id == id)[0];

     // set info
     document.querySelector("#artist-name-input").value = cover.artistName;
     document.querySelector("#single-name-input").value = cover.singleName;
     document.querySelector("#release-date-input").value = cover.releaseDate;
 
     // set title and button text
     document.querySelector("#upload-heading").innerText = "Update Cover"
     document.querySelector("#submit").innerText = "Update"
 
     // set the correct eventlistener
     let submitButton = document.getElementById("submit");
     submitButton.replaceWith(submitButton.cloneNode(true));
     document.querySelector("#submit").addEventListener("click", (event) => updateCover(event, cover.id));
 
}

/**
 * When the save button is pressed, the user is saved to the database
 * But before that a uniqueness test is made, and that the username is different from what it is now
 */
async function updateCover(event, id) {
    event.preventDefault();

    // get user
    const cover = covers.filter((cover) => cover.id == id)[0];

    // get values
    let artistName = document.querySelector("#artist-name-input").value
    let singleName = document.querySelector("#single-name-input").value
    let releaseDate = document.querySelector("#release-date-input").value

    // makes data object for transfer
    const updatePackage = {
        "artistName": artistName,
        "singleName": singleName,
        "releaseDate": releaseDate,
        "image": imageFile
    }

    await fetch(url + "/" + cover.id, {
        method: 'PATCH',
        credentials: "include",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(updatePackage)});

    //we fetch, its has two parameters; url and promise response. 
    //promise response; vi parser til JSon for at vores backend kan forstå det- header: setting: det den får
    //skal den forstå som json. backsend bruger restserver - som sender og modtager JSON

    imageFile = "";
    getCovers();

    reset();
}


async function deleteCover(id) {
    // get user
    const cover = covers.filter((cover) => cover.id == id)[0];

    if (confirm("Are you sure you want to delete: " + cover.artistname) == true) {
        await fetch(url + "/" + id, {
            method: 'DELETE',
            credentials: "include"});

        getCovers();
      } else {
        console.log("delete canceled");
      }

      reset();
}


let imageFile = "";
async function createcover(evt) {
    evt.preventDefault();

    // .value to get the value from form, or else we get the elementet. 
    let artistName = document.querySelector("#artist-name-input").value
    let singleName = document.querySelector("#single-name-input").value
    let releaseDate = document.querySelector("#release-date-input").value

    // we create a javascript object, ads input from form (look above)
    const createPackage = {
        "artistName": artistName,
        "singleName": singleName,
        "releaseDate": releaseDate,
        "image": imageFile
    }

    //we fetch, its has two parameters; url and promise response. 
    //promise response; vi parser til JSon for at vores backend kan forstå det- header: setting: det den får
    //skal den forstå som json. backsend bruger restserver - som sender og modtager JSON

    await fetch(url, {
        method: 'POST', 
        credentials: "include" ,
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(createPackage)});

    alert('artistName' + ' was created', 'success')

    imageFile = "";
    getCovers();

    reset();
}

function reset() {
    imageFile = "";

     // set info
     document.querySelector("#artist-name-input").value = "";
     document.querySelector("#single-name-input").value = "";
     document.querySelector("#release-date-input").value = "";
     document.querySelector("#cover-image").value = "";
 
     // set title and button text
     document.querySelector("#upload-heading").innerText = "Upload cover"
     document.querySelector("#submit").innerText = "Create"
 
     // set the correct eventlistener
     let submitButton = document.getElementById("submit");
     submitButton.replaceWith(submitButton.cloneNode(true));
     document.querySelector("#submit").addEventListener("click", (event) => createcover(event));
}