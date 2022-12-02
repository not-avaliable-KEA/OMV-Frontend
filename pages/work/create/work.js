import { fileLoad } from "../../../js/utils.js"

const url = "http://http://127.0.0.1:8080//api/v1/work"

let covers = []

export default async function coversInit() {
    document.querySelector("#submit").addEventListener("click", (event) => createcover(event));
    document.querySelector('#cover-image').addEventListener("change", () => fileLoad('#cover-image', (file) => {imageFile = file;}))
    getCovers();
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
        <th scope="row">${cover.id}</th>
        <td><img src="${cover.image}"></td>
        <td>${cover.artistName}</td>
        <td>${cover.singleName}</td>
        <td>${releaseDate.toLocaleDateString(undefined, options)}</td>
        <td>
            <button id="edit" class="btn btn-info" >edit</button> 
            <button id="delete" class="btn btn-danger" >delete</button>
        </td>`)


        elem.querySelector("#edit").addEventListener("click", () => edit(cover.id))
        elem.querySelector("#delete").addEventListener("click", () => deleteUser(cover.id))
    
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

    const cover = covers.filter((cover) => cover.id == id)     [0];



    // set info
    document.querySelector("#artist-name-input").value = cover.artistName;
    document.querySelector("#single-name-input").value = cover.singleName;
    document.querySelector("#release-date-input").value = cover.releaseDate;

    const uddateform = document.querySelector('#row')

    
    
    tableBody.appendChild(elem);

    
}

/**
 * When the save button is pressed, the user is saved to the database
 * But before that a uniqueness test is made, and that the username is different from what it is now
 */
async function updateCover(id) {
    // get user
    const cover = covers.filter((cover) => cover.id == id)[0];

    // get row
    const row = document.getElementById("cover" + id);

    // get values
    let artistName = row.querySelector("#artistName-input").value
    let singleName = row.querySelector("#singleName-input").value
    let releaseDate = row.querySelector('#releaseDate-input').value

    // makes data object for transfer
    const updatePackage = {
        "artistName": artistName,
        "singleName": singleName,
        "releaseDate": releaseDate
    }

    await fetch(url + "/" + id, {method: 'PATCH', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(updatePackage)});

    getCovers();
}


async function deletecover(id) {
    // get user
    const cover = covers.filter((cover) => cover.id == id)[0];

    if (confirm("Are you sure you want to delete: " + cover.artistname) == true) {
        await fetch(url + "/" + id, {method: 'DELETE'});
        getCovers();
      } else {
        console.log("delete canceled");
      }
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
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(createPackage)});

    alert('artistName' + ' was created', 'success')

    imageFile = "";
    getCovers();

}