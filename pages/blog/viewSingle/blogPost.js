import config from "../../../js/config.js"
const url = config.url + "blogpost"

let postData;

async function getPostInfo(){

    //get the url from the browser search bar
    let siteUrl = document.location.href;
    //split it into array
    let urlSplit = siteUrl.split("/")

    //get blog post id from the array and fetch post from the backend
    let postResponse = await fetch(url + "/" + urlSplit[urlSplit.length-1])
    //turn it into JSon data
    postData = await postResponse.json()

    displayPost()
}

function displayPost(){

    //Grab the div from the HTML Document we're gonna insert into later
    let templateDiv = document.getElementById("blogPost")
    templateDiv.innerHTML = ""


    //Grab all the data from the JSON
    let text = postData.text;
    let title = postData.title;
    let picture = postData.picture;


    //set the header
    let blogHeader = document.createElement("h1")
    blogHeader.innerHTML = title;

    //set the text
    let blogText = document.createElement("div")
    blogText.innerHTML = text;

    //set the picture
    let blogPicture = document.createElement("img")
    blogPicture.src = picture;
    blogPicture.style.display = "blog"
    blogPicture.style.width = "100%"


    //create the div for the blog-post
    let post = document.createElement("div")
    post.className = "row"

    //create the header div
    let postHeader = document.createElement("div")
    postHeader.className = "col-12"
    postHeader.appendChild(blogHeader)

    //create the div to hold the text 
    let postText = document.createElement("div")
    postText.className = "col-12"
    postText.appendChild(blogText)

    //create the div to hold the image
    let postImage = document.createElement("div")
    postImage.className = "col-12"
    postImage.appendChild(blogPicture)

    //append all the elements to the main post element
    post.appendChild(postHeader)
    post.appendChild(postText)
    post.appendChild(postImage)

    //insert the element into the page
    templateDiv.appendChild(post)

    //replace
}   

export default function initBlogPost() {
    //get which blog to show
    getPostInfo();
}
