
//  Slideshow script heavily based on: "https://www.w3schools.com/howto/howto_js_slideshow.asp"          
          
let slideIndex = 0;
  

    function showSlides() {
          //Create an array with all the elements with the "conainter-slide" class
          let slides = document.getElementsByClassName("container-slide")

          let i;

          //iterate through the array and remove the "active" class from all elements
          for (i = 0; i < slides.length; i++) {
              slides[i].classList.remove("active")
          }
          console.log(slides)

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
          setTimeout(showSlides, 3000)
        
    }

    export function homeInit(){
        console.log("init")
        showSlides();
    }
          
    