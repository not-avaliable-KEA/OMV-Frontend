const url = "http://localhost:8080/api/v1/work"

let covers = []

export default async function coversInit() {
    document.querySelector("#submit").addEventListener("click", (event) => createcover(event));
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

    covers.forEach(cover => {
        let elem = document.createElement("tr");
        elem.id = `cover${cover.id}`;
        

        elem.innerHTML = (`
        <th scope="row">${cover.id}</th>
        <td>${cover.image}</td>
        <td>**********</td>
        <td >
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
    // get cover
    const cover = covers.filter((cover) => cover.id == id)[0];

    // get row
    const row = document.getElementById("cover" + id);

    // get clone
    const template = document.querySelector(`#template-edit-row`);
    const clone = template.content.cloneNode(true);

    // set info
    clone.querySelector("#cover-input").value = cover.coverName;
    clone.querySelector("#id").innerHTML = cover.id;

    // set eventlistners
    clone.querySelector("#save").addEventListener("click", () => saveCover(cover.id));
    clone.querySelector("#cancel").addEventListener("click", () => displayCovers(cover.id));
    clone.querySelector("#delete").addEventListener("click", () => deleteCover(cover.id));

    // set clone
    row.innerHTML = "";
    row.appendChild(clone);
}

/**
 * When the save button is pressed, the user is saved to the database
 * But before that a uniqueness test is made, and that the username is different from what it is now
 */
async function saveCover(id) {
    // get user
    const user = covers.filter((cover) => cover.id == id)[0];

    // get row
    const row = document.getElementById("cover" + id);

    // get values
    let username = row.querySelector("#artistName-input").value
    let password = row.querySelector("#singleName-input").value

    // check for dublicate username 
    let dublicateUsername = false;
    users.forEach((u) => { if (u.username === username && u.id !== id) dublicateUsername = true });

    // set invalid message
    if (dublicateUsername) {
        row.querySelector("#username-input").classList.add("is-invalid");
        return
    }

    // check if username needs updating
    if (user.username === username ) username = "";


    // makes data object for transfer
    const updatePackage = {
        "username": username,
        "password": password
    }

    await fetch(url + "/" + id, {method: 'PATCH', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(updatePackage)});

    getUsers();
}


async function deleteUser(id) {
    // get user
    const cover = covers.filter((cover) => cover.id == id)[0];

    if (confirm("Are you sure you want to delete: " + cover.artistname) == true) {
        await fetch(url + "/" + id, {method: 'DELETE'});
        getUsers();
      } else {
        console.log("delete canceled");
      }
}


async function createcover(evt) {
    evt.preventDefault();

    // get row
    const form = document.querySelector("#cover-form");
    console.log(form);

    console.log(document.querySelector("#artist-name-input"));
    // .value to get the value from form, or else we get the elementet. 
    let artistName = document.querySelector("#artist-name-input").value
    let singleName = document.querySelector("#single-name-input").value


    // we create a javascript object, ads input from form (look above)
    const createPackage = {
        "artistName": artistName,
        "singleName": singleName
    }

    //we fetch, its has two parameters; url and promise response. 
    //promise response; vi parser til JSon for at vores backend kan forstå det- header: setting: det den får
    //skal den forstå som json. backsend bruger restserver - som sender og modtager JSON

    await fetch(url, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(createPackage)});

    alert('artistName' + ' was created', 'success')

    getCovers();

}