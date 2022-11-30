
//Slideshow script heavily based on: "https://www.w3schools.com/howto/howto_js_slideshow.asp"          
      

let slideIndex = 0;
let isHovering = false;

//Function to add event listeners to all the images
function elementsAddEventListener() {

    //gather an array of all the elmements to add listeners to
    let images = document.querySelectorAll(".image-container")

    //iterates over each element in the array 
    images.forEach(image => {

        //on mouse over event - does something whenever you hover over the element
        //in this case, it sets the "isHovering" boolean to true when you hover over an element
        image.addEventListener('mouseover', (event) => {
            console.log(isHovering)
            isHovering = true;
        })

        //on mouse leave event - does something whenever your mouse leaves the element
        //in this case, it sets the "isHovering" boolean to false when you stop hovering over an element
        image.addEventListener('mouseleave', (event) => {
            console.log(isHovering)
            isHovering = false;
        })
    });
}


    function showSlides() {
        //Create an array with all the elements with the "conainter-slide" class
        let slides = document.getElementsByClassName("container-slide")

        let i;

        //check whether the "isHovering" variable is true
        //if the variable is true - eg. a user is hovering over a picture
        //then this part of the script stops, and it won't go to next slide
        if (isHovering === false){

            //iterate through the array and remove the "active" class from all elements
            //add's event listener to pause  scroll
            for (i = 0; i < slides.length; i++) {
                slides[i].classList.remove("active")
            }

            //increase the index by 1 - used to keep track of when to "reset" 
            //the slideshow, showing the first section again
            slideIndex++;

            //resets the index to 1
            if (slideIndex > slides.length) {
                slideIndex = 1
            }

            //applies "active" class to the element that needs to be shown 
            //notice that the class is applied to index-1, which is why the index resets to 1
            slides[slideIndex-1].classList.add("active")
        }

        //runs this function every 3 seconds
        setTimeout(showSlides, 3000)
    }

    //initial function that's fired to start the script up
    export function homeInit(){
        console.log("init")
        elementsAddEventListener()
        showSlides();
    }
          
    