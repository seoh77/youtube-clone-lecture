const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteIcon = document.querySelectorAll(".delete__icon");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const deleteIcon = document.createElement("span");
  deleteIcon.innerText = "❌";
  deleteIcon.className = "delete__icon";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteIcon);
  videoComments.prepend(newComment); // append는 댓글 목록 맨 끝에 새로운 댓글이 추가되고, prepend는 목록 맨 처음에 새로운 댓글이 추가된다.

  deleteIcon.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
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
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }), // JSON.stringify() : object를 string으로 만들어준다.
  });

  // 따로 설정을 하지 않을 경우 fetch가 (성공/실패 유무와 관계없이) 끝나면 이후 코드가 실행된다.
  // 여기서 댓글 입력에 성공했을 때만 코드를 실행하고 싶다면 if문을 사용해서 status에 따라 코드를 실행시키면 된다.
  if (response.status === 201) {
    // 댓글을 submit한 이후에는 댓글창 초기화
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }

  //   window.location.reload(); // 직접 새로고침을 해주면서 댓글이 실시간으로 남겨지는 것처럼 보여준다.
};

const handleDelete = async (event) => {
  const videoComment = document.querySelector(".video__comment");
  const commentId = videoComment.dataset.id;

  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "Delete",
  });

  if (response.status === 201) {
    const deleteComment = event.target.parentElement;
    deleteComment.remove();
  }
};

// 로그인이 안 되어 있을 경우 form이 없어서 EventListener을 실행할 수 없다고 에러가 뜨기 때문에 form이 있을 경우에만 실행하는 것으로 코드 수정
if (form) {
  form.addEventListener("submit", handleSubmit); // btn을 클릭하면 form이 전송되기 때문에 btn의 클릭 이벤트를 감지하는 것이 아니라 form의 submit event를 감지해야 한다.
  deleteIcon.forEach((icon) => icon.addEventListener("click", handleDelete));
}
