const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm"; // 다운로드 할 포맷도 지정해주기
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handelStart = () => {
  startBtn.innerText = "Stop Recording";
  // startBtn을 또 한 번 누르게 되면 handleStop()이 실행되도록 만들기 위해서
  // 우선 실행되고 있는 click event를 제거하고, handleStop을 실행하는 click event를 추가한다.
  startBtn.removeEventListener("click", handelStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); // createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어준다.
    video.srcObject = null;
    video.src = videoFile; // 녹화한 비디오 미리보기
    video.loop = true; // 반복재생
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handelStart);
