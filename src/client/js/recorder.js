const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handelStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 200, height: 100 },
  });
  video.srcObject = stream;
  video.play();
};

startBtn.addEventListener("click", handelStart);
