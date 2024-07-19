let currentsong = new Audio();
let songs;
let currFolder;
async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`)
  // console.log(a)
  let responses = await a.text();
  // console.log(responses)
  let div = document.createElement("div");
  div.innerHTML = responses;
  let as = div.getElementsByTagName("a");
  // console.log(as);
  songs = [];
  for (let i = 0; i < as.length; i++) {

    const element = as[i];
    // console.log(element)
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `
     <li>
                <div class="info "  >
                  <img src="music.svg" alt="">
                  <div class="name">
                    <div>${song.replaceAll("%20", " ")} </div>
                    <div>song info</div>

                  </div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img src="play.svg" alt="">
                </div>
            </li>             
    `
  }
  //  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(r=>{
  //      r.addEventListener("click",element=>{
  //       console.log(r.querySelector(".info").firstElementChild.innerHTML)
  //       Playmusic(r.querySelector(".info").firstElementChild.innerHTML.trim())
  //      })

  //  })

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").childNodes[3].childNodes[1].innerHTML);
      Playmusic(e.querySelector(".info").childNodes[3].childNodes[1].innerHTML.trim())
    })
  })




}
const Playmusic = (track, pause = false) => {
  // let audio=new Audio("/songs/"+ track);

  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg"

  }

  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbum(){
  let a = await fetch(`/songs/`)
  //console.log(a)
  let responses = await a.text();
  // console.log(responses)
  let div = document.createElement("div");
  div.innerHTML = responses;
  let ass=div.getElementsByTagName("a")
  let cardcontainer=document.querySelector(".cardcontainer")
  let array=Array.from(ass)
  for(let i=0;i<array.length;i++){
    const e = array[i]; 
    if(e.href.includes("/songs")){
      let folder=e.href.split("/").slice(-2)[0];
      console.log(folder)
       
    let a=await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
    let response= await a.json();
    console.log(response.title)
   
    cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">

            <div class="playy"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <rect width="24" height="24" rx="12" fill="green" />
                <path
                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                  fill="black" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg"alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`

      
    }
  }
}
async function main() {

  await getsongs("songs/ncs");
  await displayAlbum();
  Playmusic(songs[0], true)
  // console.log(songs[0])
  // var audio = new Audio(songs[1]);
  //  audio.play();


  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg"
    }
    else {
      currentsong.pause();
      play.src = "play.svg";
    }
  })



  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `
   ${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime) / (currentsong.duration) * 100 + "%";
  })

  // document.querySelector(".seekbar").addEventListener("click",e=>{
  // let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
  // document.querySelector(".circle").style.left=percent + "%";
  // currentsong.currentTime=((currentsong.duration)*percent)/100;

  // }

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";



  })

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-114%";
  })

  prevsong.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    console.log(songs.length)
    console.log(index)
    if (index > 0) {
      Playmusic(songs[index - 1]);
    }

  })
  nextsong.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // console.log(songs.length)

    if (index + 1 < songs.length) {
      Playmusic(songs[index + 1]);
    }
  })

  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    // console.log(e.target.value);
    currentsong.volume = e.target.value / 100;
  })


  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
  })

  document.querySelector(".volume>img").addEventListener("click",(e)=>{


    if(e.target.src.includes("mute.svg")){
      volume.src="volume.svg"
      currentsong.volume=0.5;
      document.querySelector(".volume").getElementsByTagName("input")[0].value=0.5;
    }
    else{
    currentsong.volume=0;
    volume.src="mute.svg"
    document.querySelector(".volume").getElementsByTagName("input")[0].value=0
    }
  })
}


main();