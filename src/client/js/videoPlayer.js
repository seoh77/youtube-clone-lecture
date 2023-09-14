const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

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

// Date()를 사용해서 00:00:00 format 만들기
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // video.duration : video의 전체 길이 가져오기
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

// 첫번째 방법
// playBtn.addEventListener("click", handlePlayClick);
// muteBtn.addEventListener("click", handleMuteClick);
// volumeRange.addEventListener("input", handleVolumeChange);

// 두번째 방법
playBtn.onclick = handlePlayClick;
muteBtn.onclick = handleMuteClick;
volumeRange.oninput = handleVolumeChange;

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate); // 비디오 시간이 업데이트 될 때마다 JS가 해당 이벤트를 실행
timeline.addEventListener("input", handleTimelineChange);
