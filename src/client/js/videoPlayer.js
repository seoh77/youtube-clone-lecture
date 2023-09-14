const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;

video.volume = volumeValue;

const handlePlayClick = (e) => {
  console.log("Play");
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    // else play the video
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = (e) => {
  console.log("Mute");
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  console.log("Volume");
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value; // global variable를 업데이트
  video.volume = value; // 비디오의 볼륨을 바꾸는 역할
};

// playBtn.addEventListener("click", handlePlayClick);
playBtn.onclick = handlePlayClick;
// muteBtn.addEventListener("click", handleMuteClick);
muteBtn.onclick = handleMuteClick;
// volumeRange.addEventListener("change", handleVolumeChange);
volumeRange.onchange = handleVolumeChange;
