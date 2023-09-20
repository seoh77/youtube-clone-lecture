import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName; // 다운로드 할 포맷도 지정해주기
  document.body.appendChild(a); // body에 존재하지 않는 링크는 클릭할 수 없기 때문에 링크를 body에 추가하는 단계는 필수
  a.click(); // user 대신 클릭해줌
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "Transcoding...";

  actionBtn.disabled = true;

  // 1단계: ffmpeg instance 만들기
  const ffmpeg = createFFmpeg({ log: true }); // {log: true}를 사용하면 무슨 일이 일어나고 있는지 콘솔에서 확인할 수 있다.
  await ffmpeg.load(); // 사용자가 소프트웨어를 사용할 것이기 때문에 ffmpeg.load()를 await한다.

  // 2단계: ffmpeg에 파일 만들기
  // ffmpeg.FS의 method 종류 : readFile, unlink, writeFile
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile)); // writeFile은 가상 컴퓨터에 파일을 생성하는 역할

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  // 가상 컴퓨터에 이미 존재하는 파일을 input으로 받아서 output.mp4로 변환
  // "-i"는 input을 의미
  // "-r", "60"은 영상을 초당 60프레임으로 인코딩 해주는 명령어 (=> 더 빠른 영상 인코딩을 가능하게 해준다.)

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss", // "-ss"는 영상의 특정 시간대로 이동할 수 있게 한다.
    "00:00:01",
    "-frames:v", // "-frames:v", "1" 은 첫 프레임의 스크린샷을 찍어주는 명령어
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  // output.mp4 파일은 Uint8Array(array of 8-bit unsigned integers) 타입
  // unsigned integers는 양의 정수를 의미한다. (음수는 '-'라는 sign이 있으므로 signed)

  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  // binary data를 사용하고 싶다면 buffer를 사용해야 한다.
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // 파일의 링크를 해제 (파일을 계속 가지고 있으면 속도가 느려질 수도 있으므로)
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // url 삭제
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handelStart);
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;

  actionBtn.removeEventListener("click", handelStart);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); // createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어준다.
    video.srcObject = null;
    video.src = videoFile; // 녹화한 비디오 미리보기
    video.loop = true; // 반복재생
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000); // 영상이 너무 길면 변환하는데 시간이 오래 걸리므로 5초 후에 녹화가 끝나도록 만들었다.
};

const init = async () => {
  // getUserMedia는 mediaDevices 객체의 함수로 마이크, 카메라와 같은 미디어 장비들에 접근할 수 있게 한다.
  // 이런 것들이 return 해주는 것은 stream이다. (stream은 우리가 어딘가에 넣어둘 0과 1로 이루어진 데이터를 의미한다.)
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
