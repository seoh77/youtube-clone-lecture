import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  // 1단계: ffmpeg instance 만들기
  const ffmpeg = createFFmpeg({ log: true }); // {log: true}를 사용하면 무슨 일이 일어나고 있는지 콘솔에서 확인할 수 있다.
  await ffmpeg.load(); // 사용자가 소프트웨어를 사용할 것이기 때문에 ffmpeg.load()를 await한다.

  // 2단계: ffmpeg에 파일 만들기
  // ffmpeg.FS의 method 종류 : readFile, unlink, writeFile
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); // writeFile은 가상 컴퓨터에 파일을 생성하는 역할

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  // 가상 컴퓨터에 이미 존재하는 파일을 input으로 받아서 "output.mp4"로 변환
  // "-i"는 input을 의미
  // "-r", "60"은 영상을 초당 60프레임으로 인코딩 해주는 명령어 (=> 더 빠른 영상 인코딩을 가능하게 해준다.)

  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss", // "-ss"는 영상의 특정 시간대로 이동할 수 있게 한다.
    "00:00:01",
    "-frames:v", // "-frames:v", "1" 은 첫 프레임의 스크린샷을 찍어주는 명령어
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  // output.mp4 파일은 Uint8Array(array of 8-bit unsigned integers) 타입
  // unsigned integers는 양의 정수를 의미한다. (음수는 '-'라는 sign이 있으므로 signed)

  const thumbnFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  // binary data를 사용하고 싶다면 buffer를 사용해야 한다.
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbnFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4"; // 다운로드 할 포맷도 지정해주기
  document.body.appendChild(a); // body에 존재하지 않는 링크는 클릭할 수 없기 때문에 링크를 body에 추가하는 단계는 필수
  a.click(); // user 대신 클릭해줌

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();
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
  // getUserMedia는 mediaDevices 객체의 함수로 마이크, 카메라와 같은 미디어 장비들에 접근할 수 있게 한다.
  // 이런 것들이 return 해주는 것은 stream이다. (stream은 우리가 어딘가에 넣어둘 0과 1로 이루어진 데이터를 의미한다.)
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handelStart);
