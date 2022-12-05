

let liveVideo = {
    id: 1,
    url: "https://www.youtube.com/watch?v=WNUZNXDIE2w",
    title: "Eths - Crucifère (Official Live Video) ",
    intro: "Filmed live at the Divan du Monde in Paris, France on October 24, 2013. Audio available on the 'Ex Umbra In Solem' EP, out on March 14.",
    date: "2014-3-14"
}

/**
 * @param {number} id 
 */
export default function liveVideoViewOneInit(id) {
    // fetch liveVideo

    
    display();
}

function display() {
    // heading
    document.getElementById("heading").innerText = liveVideo.title;
    
    // date
    let releaseDate = new Date(liveVideo.date);
    let options = {year: 'numeric', month: 'long', day: 'numeric'};
    document.getElementById("date").innerText = releaseDate.toLocaleDateString(undefined, options);

    // video
    liveVideo.videoId = liveVideo.url.match(/watch\?v=([^\/?]+)/)[1];

    const viewer = document.getElementById("viewer");
    viewer.src = "https://www.youtube-nocookie.com/embed/" + liveVideo.videoId;
    viewer.title = liveVideo.title;
    
    
    // intro
    document.getElementById("intro").innerText = liveVideo.intro;

}