const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const mute = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    // else play the video
    video.pause();
  }
};

const handelPause = () => (playBtn.innerText = "Play");
const handelPlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.onclick = handlePlayClick;
video.addEventListener("pause", handelPause);
video.addEventListener("play", handelPlay);

mute.addEventListener("click", handleMute);
