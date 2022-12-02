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
    let templateDiv = document.getElementById("blogPostContainer")
    templateDiv.innerHTML = ""



    //Grab all the data from the JSON
    let text = postData.text;
    let title = postData.title;
    let picture = postData.picture;
    let date = postData.createdDate;



    //set the header
    let blogHeader = document.createElement("h1")
    blogHeader.innerHTML = title;

    //Set the created date
    let blogDate = document.createElement("div")
    blogDate.innerHTML = date;
    blogDate.className = "col-md-6"

    //Set the edit/delete buttons
    let editButton = document.createElement("button")
    editButton.innerHTML = "edit"
    editButton.style.visibility = "hidden"
    editButton.className = "col-md-3 btn btn-info"
    let deleteButton = document.createElement("button")
    deleteButton.innerHTML = "delete"
    deleteButton.style.visibility = "hidden"
    deleteButton.className = "col-md-3 btn btn-danger"

    //set the picture
    let blogPicture = document.createElement("img")
    blogPicture.src = picture;
    blogPicture.style.display = "blog"
    blogPicture.style.width = "100%"

    //set the text
    let blogText = document.createElement("div")
    blogText.innerHTML = text;

   

    //create the div for the blog-post
    let post = document.createElement("div")
    post.className = "row"

    //create the header div
    let postHeader = document.createElement("div")
    postHeader.className = "col-12"
    postHeader.className = "pt-3"
    postHeader.appendChild(blogHeader)

    //create the div to hold date/time as well as edit/delete buttons
    let postDate = document.createElement("div")
    postDate.className = "col-12 row" 
    postDate.appendChild(blogDate)
    postDate.appendChild(editButton)
    postDate.appendChild(deleteButton)

    //create the div to hold the image
    let postImage = document.createElement("div")
    postImage.className = "col-12"
    postImage.appendChild(blogPicture)

     //create the div to hold the text 
     let postText = document.createElement("div")
     postText.className = "col-12"
 
     postText.appendChild(blogText)

    //append all the elements to the main post element
    //This decides the placement of hte elements
    post.appendChild(postHeader)
    post.appendChild(postDate)
    post.appendChild(postImage)
    post.appendChild(postText)

    //insert the element into the page
    templateDiv.appendChild(post)

    displayButtons(editButton, deleteButton);
}   

function displayButtons(editButton, deleteButton){

    console.log("Testy testy")

    if ((sessionStorage.getItem("username") != null && sessionStorage.getItem("username") !== "")
    && (sessionStorage.getItem("userId") > 0 && sessionStorage.getItem("userId") != null)) {
        // set link to edit and remove hidden
        editButton.style.visibility = "visible";
        editButton.addEventListener("click", () => document.location = "#/blog/" + postData.id + "/edit");
        // set link to delete and remove hidden
        deleteButton.style.visibility = "visible";
        deleteButton.addEventListener("click", () => deletePost(postData.id));
        
        console.log("testy")
    }
}

export default function initBlogPost() {
    //get which blog to show
    getPostInfo();
    
    
}
