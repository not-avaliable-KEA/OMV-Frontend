import config from "../../../js/config.js"
const blogPostUrl = config.url + "blogpost"
const liveVideoUrl = config.url + "blogpost"


let posts;
let blogPosts;
let liveVideos = [
    {
        id: 1,
        url: "https://www.youtube.com/watch?v=WNUZNXDIE2w",
        title: "Eths - Crucifère (Official Live Video)",
        intro: "Filmed live at the Divan du Monde in Paris, France on October 24, 2013. Audio available on the 'Ex Umbra In Solem' EP, out on March 14.",
        date: "2014-3-14"
    },
    {
        id: 2,
        url: "https://www.youtube.com/watch?v=QlUyM9G5s-8",
        title: "Architects - For Those That Wish to Exist (Full Album)",
        intro: "Artist: Architects \nAlbum: For Those That Wish to Exist\nGenre: Metalcore / Alternative metal\nYear: 2021",
        date: "2021-2-26"
    },
    {
        id: 3,
        url: "https://www.youtube.com/watch?v=8JpOcvvnX_s",
        title: "UNLEASH THE ARCHERS - Faster Than Light (Official Video) | Napalm Records",
        intro: "Being that this song is about racing off into the far corners of space, we thought it would be a fun idea to actually race each other in the music video to see which one of us was truly 'Faster Than Light'!  Of course we had to have some fun with it though, and added a little bit of excitement into the mix. Our director mentioned an older Stephen King novel called The Long Walk as inspiration for a way to spice up the video and we all agreed it would be hilarious! Check out the plot synopsis on Wikipedia if you haven't read it already... This track has turned into a favourite of the band and we knew it had to be a single the moment the finished product was in our hands. It's fast, fun, and is going to be an absolute blast to play live!",
        date: "2022-12-24"
    }
];

export default async function initBlog() {
    // get blog posts
    let response = await fetch(blogPostUrl)
    blogPosts = Array.from(await response.json());
    blogPosts.forEach((post) => post.type = "post")

    // get live videos
    liveVideos.forEach((video) => {
        video.type = "video";
        video.videoId = video.url.match(/watch\?v=([^\/?]+)/)[1];
    });

    // join and sort
    posts = blogPosts.concat(liveVideos);
    posts = posts.sort((a,b) => {
        let valA, valB;

        if (a.type === "video") {
            valA = dateUTCParse(a.date)
        } else {
            valA = dateUTCParse(a.createdDate)
        }
        
        if (b.type === "video") {
            valB = dateUTCParse(b.date)
        } else {
            valB = dateUTCParse(b.createdDate)
        }

        console.log(valA + " - " + valB + " = " + (valA - valB));
        return  valB - valA
    });

     // if logged in enable create button and set link
     if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "") && 
         (sessionStorage.getItem("userId")   != null && sessionStorage.getItem("userId") > 0)) {
            document.getElementById("create-blog-button").hidden = false;
            document.getElementById("create-live-button").hidden = false;
     }

     // add sort mechanism
    display();
}

function dateUTCParse(date) {
    let temp = date.split(" ")[0].split("-");
    return Date.UTC(temp[0], temp[1]-1, temp[2])
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


    //displayBlogPosts();
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
        </div>`

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
        text = text.substring(0, 400) + "..."
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
    </div>`

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