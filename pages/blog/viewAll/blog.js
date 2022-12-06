import config from "../../../js/config.js"
const blogPostUrl = config.url + "blogpost"
const liveVideoUrl = config.url + "liveVideo"


let posts = [];
let blogPosts = [];
let liveVideos = [];

export default async function initBlog() {
    // get blog posts
    let response = await fetch(blogPostUrl);
    blogPosts = Array.from(await response.json());
    if (blogPosts.length > 0) {
        blogPosts.forEach((post) => post.type = "post");
    }

    // get live videos
    response = await fetch(liveVideoUrl);
    liveVideos = Array.from(await response.json());
    if (liveVideos.length > 0) {
        liveVideos.forEach((video) => {
            video.type = "video";
            video.videoId = video.url.match(/watch\?v=([^\/?]+)/)[1];
        });
    }
    

    // join and sort
    posts = blogPosts.concat(liveVideos);
    posts = posts.sort((a,b) => extractUTCEpochTime(b) - extractUTCEpochTime(a) );

     // if logged in enable create button and set link
     if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "") && 
         (sessionStorage.getItem("userId")   != null && sessionStorage.getItem("userId") > 0)) {
            document.getElementById("create-blog-button").hidden = false;
            document.getElementById("create-live-button").hidden = false;
     }

     // add sort mechanism
    display();
}

function extractUTCEpochTime(elem) {
    if (elem.type === "video") {
        let temp = elem.date.split(/[-\s:]/);
        return Date.UTC(temp[0], temp[1]-1, temp[2])
    } else {
        let temp = elem.createdDate.split(/[-\s:]/);
        return Date.UTC(temp[0], temp[1]-1, temp[2], temp[3], temp[4])
    }
}

function display() {
    let postContainer = document.getElementById("blog-posts");
    postContainer.innerHTML = '';

    posts.forEach((post) => {

        if (post.type === "post") {
            postContainer.appendChild(displayBlogPost(post));
        } else if (post.type === "video") {
            postContainer.appendChild(displayLiveVideo(post));
        }

    });
}

function displayBlogPost(blogPost) {

        let postTemplate = document.createElement("div");
        postTemplate.id = "blogpost-" + blogPost.id;

        let text = blogPost.text;
        if (text.length > 400) {
            text = text.substring(0, 400) + "..."
        }

        postTemplate.innerHTML = `<div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img id="picture" src="${blogPost.picture}" class="img-fluid rounded-start" alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 id="title" class="card-title">${blogPost.title} <span class="badge bg-primary">Post</span> </h5>
                    <p id="text" class="card-text">${text}</p>
                    <p id="CreateDate" class="card-text"><small class="text-muted">Post Created: ${blogPost.createdDate}</small></p>
                    <button id="read-more" class="btn btn-primary">Læs mere</button>
                    <button id="edit" class="btn btn-info" hidden>Edit</button>
                    <button id="delete" class="btn btn-danger" hidden>Delete</button>
                </div>
            </div>
        </div>
        </div>`;

        // set link to read more
        postTemplate.querySelector("#read-more").addEventListener("click", () => document.location = "#/blog/" + blogPost.id);

        // if logged in
        if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "")
            && (sessionStorage.getItem("userId") > 0 && sessionStorage.getItem("userId") != null)) {
                // set link to edit and remove hidden
                postTemplate.querySelector("#edit").hidden = null;
                postTemplate.querySelector("#edit").addEventListener("click", () => document.location = "#/blog/" + blogPost.id + "/edit");
                // set link to delete and remove hidden
                postTemplate.querySelector("#delete").hidden = null;
                postTemplate.querySelector("#delete").addEventListener("click", () => deleteBlogPost(blogPost.id));
            }

        return postTemplate
}

function displayLiveVideo(video) {

    let postTemplate = document.createElement("div");
    postTemplate.id = "liveVideo-" + video.id;

    let text = video.intro;
    if (text.length > 400) {
        text = text.substring(0, 400) + "...";
    }

    

    postTemplate.innerHTML = `
    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img id="picture" src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg" class="img-fluid rounded-start" alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"> <span id="title" >${video.title}</span> <span class="badge bg-danger">Video</span></h5>
                    <p id="intro" class="card-text">${text}</p>
                    <p id="CreateDate" class="card-text"><small class="text-muted">Post Created: ${video.date}</small></p>
                    <button id="read-more" class="btn btn-primary">Se video</button>
                    <button id="edit" class="btn btn-info" hidden>Edit</button>
                    <button id="delete" class="btn btn-danger" hidden>Delete</button>
                </div>
            </div>
        </div>
    </div>`;

    // set link to read more
    postTemplate.querySelector("#read-more").addEventListener("click", () => document.location = "#/blog/video/" + video.id);

    // if logged in
    if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "")
        && (sessionStorage.getItem("userId") > 0 && sessionStorage.getItem("userId") != null)) {
            // set link to edit and remove hidden
            postTemplate.querySelector("#edit").hidden = null;
            postTemplate.querySelector("#edit").addEventListener("click", () => document.location = "#/blog/video/" + video.id + "/edit");
            // set link to delete and remove hidden
            postTemplate.querySelector("#delete").hidden = null;
            postTemplate.querySelector("#delete").addEventListener("click", () => deleteLiveVideo(video.id));
        }

    return postTemplate
}



async function deleteBlogPost(id) {
        // get user
        const post = blogPosts.filter((p) => p.id == id)[0];
    
        if (confirm("Are you sure you want to delete: " + post.title) == true) {
            await fetch(blogPostUrl + "/" + id, {method: 'DELETE', credentials:'include'});
            initBlog();
          } else {
            console.log("delete canceled");
          }
}

async function deleteLiveVideo(id) {
    // get user
    const post = liveVideos.filter((p) => p.id == id)[0];

    if (confirm("Are you sure you want to delete: " + post.title) == true) {
        await fetch(liveVideoUrl + "/" + id, {method: 'DELETE', credentials:'include'});
        initBlog();
      } else {
        console.log("delete canceled");
      }
}
