const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault(); // from을 전송하면 자동으로 새로고침 되는 event 막기

  // 로그인이 안 되어 있다면 form이 존재하지 않아 에러가 나기 때문에 함수 내부에 선언하는 것으로 위치를 변경했다.
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  // 사용자가 아무것도 입력하지 않았다면 request를 보낼 필요가 없음
  if (text === "") {
    return;
  }

  // fetch는 JS를 통해서 URL의 변경없이 request를 보낼 수 있게 만든다.
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }), // JSON.stringify() : object를 string으로 만들어준다.
  });
};

// 로그인이 안 되어 있을 경우 form이 없어서 EventListener을 실행할 수 없다고 에러가 뜨기 때문에 form이 있을 경우에만 실행하는 것으로 코드 수정
if (form) {
  form.addEventListener("submit", handleSubmit); // btn을 클릭하면 form이 전송되기 때문에 btn의 클릭 이벤트를 감지하는 것이 아니라 form의 submit event를 감지해야 한다.
}
