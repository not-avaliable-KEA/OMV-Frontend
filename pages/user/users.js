const url = "http://localhost:8080/api/v1/user"

let users = []

async function getUsers() {
    let response = await fetch(url)
    users = Array.from(await response.json());

    displayUsers();
}
getUsers();

function displayUsers() {
    let tableBody = document.getElementById("user-body")
    tableBody.innerHTML = "";

    users.forEach(user => {
        tableBody.innerHTML += (`<tr id="user${user.id}">
        <th scope="row">${user.id}</th>
        <td>${user.username}</td>
        <td>**********</td>
        <td >
            <button id="edit" class="btn btn-info" onclick="edit(${user.id})">edit</button> 
            <button id="delete" class="btn btn-danger" onclick="deleteUser(${user.id})">delete</button>
        </td>
      </tr>`)

    });
}

function edit(id) {
    // get user
    const user = users.filter((u) => u.id == id)[0];

    // get row
    const row = document.getElementById("user" + id);

    // get clone
    const template = document.querySelector(`#template-edit-row`);
    const clone = template.content.cloneNode(true);

    // set info
    clone.querySelector("#username-input").value = user.username;
    clone.querySelector("#id").innerHTML = user.id;

    // set eventlistners
    clone.querySelector("#save").addEventListener("click", () => saveUser(user.id));
    clone.querySelector("#cancel").addEventListener("click", () => displayUsers(user.id));
    clone.querySelector("#delete").addEventListener("click", () => deleteUser(user.id));

    // set clone
    row.innerHTML = "";
    row.appendChild(clone);
}


async function saveUser(id) {
    // get user
    const user = users.filter((u) => u.id == id)[0];

    // get row
    const row = document.getElementById("user" + id);

    // get values
    let username = row.querySelector("#username-input").value
    let password = row.querySelector("#password-input").value

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
    const user = users.filter((u) => u.id == id)[0];

    if (confirm("Are you sure you want to delete: " + user.username) == true) {
        await fetch(url + "/" + id, {method: 'DELETE'});
        getUsers();
      } else {
        console.log("delete canceled");
      }
}
