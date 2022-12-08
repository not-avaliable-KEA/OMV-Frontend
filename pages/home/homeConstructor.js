import config from "../../../js/config.js";

const url = config.url + "work";

let covers = [];
let numberOfSlides;

export default async function homeConstructionInit(){
    getCovers()
}

/**
 * Responsible for getting covers from the database
 */
 async function getCovers() {
    let response = await fetch(url);
    covers = Array.from(await response.json());
    
    console.log(covers);
    createSlides()
  }

//Construct the rows/slide containers
function createSlides() {
    //set the number of slides to create
    numberOfSlides = Math.ceil(covers.length/3);

    //console.log(numberOfSlides)

    //Grab the div from the HTML Document we're gonna insert into later
    let templateDiv = document.getElementById("carouselContainer")    
    templateDiv.innerHTML = ""

    //create the slides for the slider based on number of works
    for (let i = 0; i < numberOfSlides; i++){

      //create the element
      let element = document.createElement("div")
      //give it an id - used later to add images
      element.id = `slider-${i}`

      //make sure only the first slide have the active class
      if (i === 0){
        element.className = "active container-slide row"
      } else {
        element.className = "container-slide row"
      }

      //Append the element
      templateDiv.appendChild(element)
    }
    
    createSlideInnerElements()
  }

  function createSlideInnerElements(){
    //variable keeping track of which cover we're at
    let coverTracker = 0;
    

    //variable to keep track of which slide to append child elements to
    let slideDiv;

        //loop to iterate through the slides
       for (let i = 0; i < numberOfSlides; i++){
        slideDiv = document.getElementById(`slider-${i}`)

          //loop to add elements to the slides
          for (let ii = 0; ii < 3; ii++){

            //Make sure to only create elements if they exist
            if (coverTracker < covers.length){

              //Set all the elements
                //set the main element
                let element = document.createElement("div")
                element.className = "col-4 image-container"

                //set the overlay element
                let overlay = document.createElement("div")
                overlay.className = "overlay"

                //set the image
                let divImage = document.createElement("img")
                divImage.src = covers[coverTracker].image
                divImage.className = "image"

                //set the text overlay
                let textOverlay = document.createElement("div")
                textOverlay.className = "text-overlay"
                textOverlay.innerText = covers[coverTracker].artist


                //Append elements together
                overlay.appendChild(divImage)
                element.appendChild(overlay)
                element.appendChild(textOverlay)

                slideDiv.appendChild(element)
                }


     

                coverTracker++;

          }
      }
  }

