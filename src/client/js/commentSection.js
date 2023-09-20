const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault(); // from을 전송하면 자동으로 새로고침 되는 event 막기

  const text = textarea.value;
  const video = videoContainer.dataset.id;

  console.log(video);
};

form.addEventListener("submit", handleSubmit); // btn을 클릭하면 form이 전송되기 때문에 btn의 클릭 이벤트를 감지하는 것이 아니라 form의 submit event를 감지해야 한다.
