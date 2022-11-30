import config from "../../../js/config.js"
const url = config.url + "blogpost"

let blogPosts;

export default async function initBlog() {
    let response = await fetch(url)
    blogPosts = Array.from(await response.json());

    displayBlogPosts();
}

function displayBlogPosts() {
let posts = document.getElementById("blog-posts");
posts.innerHTML = '';

    blogPosts.forEach(post => {
        let postTemplate = document.createElement("div");
        postTemplate.id = "blogpost-" + post.id;

        postTemplate.innerHTML = `<div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img id="picture" src="${post.picture}" class="img-fluid rounded-start" alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 id="title" class="card-title">${post.title}</h5>
                    <p id="text" class="card-text">${post.text}</p>
                    <p id="CreateDate" class="card-text"><small class="text-muted">Post Created: ${post.createdDate}</small></p>
                    <button id="read-more" class="btn btn-primary">Læs mere</button>
                    <button id="edit" class="btn btn-info" hidden>Edit</button>
                    <button id="delete" class="btn btn-danger" hidden>Delete</button>
                </div>
            </div>
        </div>
        </div>`

        // set link to read more
        postTemplate.querySelector("#read-more").addEventListener("click", () => document.location = "#/blog/" + post.id);

        // if logged in
        if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "")
            && (sessionStorage.getItem("userId") > 0 && sessionStorage.getItem("userId") != null)) {
                // set link to edit and remove hidden
                postTemplate.querySelector("#edit").hidden = null;
                postTemplate.querySelector("#edit").addEventListener("click", () => document.location = "#/blog/" + post.id + "/edit");
                // set link to delete and remove hidden
                postTemplate.querySelector("#delete").hidden = null;
                postTemplate.querySelector("#delete").addEventListener("click", () => deletePost(post.id));
            }

        posts.appendChild(postTemplate);
    });

}

async function deletePost(id) {
        // get user
        const post = blogPosts.filter((p) => p.id == id)[0];
    
        if (confirm("Are you sure you want to delete: " + post.title) == true) {
            await fetch(url + "/" + id, {method: 'DELETE'});
            initBlog();
          } else {
            console.log("delete canceled");
          }
}