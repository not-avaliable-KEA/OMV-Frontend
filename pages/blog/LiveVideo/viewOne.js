import config from "../../../js/config.js";

const url = config.url + "liveVideo"

let liveVideo;

/**
 * @param {number} id 
 */
export default async function liveVideoViewOneInit(id) {
    // fetch liveVideo
    let response = await fetch(url + "/" + id, {
        method: "GET",
        credentials: "include",
        headers: {'Content-Type': 'application/json'}
    });
    liveVideo = await response.json();
    
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