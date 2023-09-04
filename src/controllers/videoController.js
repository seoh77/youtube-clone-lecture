import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = (req, res) => {
  const { id } = req.params; // const id = req.params.id를 ES6를 사용하면 const { id } = req.params 으로 나타낼 수 있다.
  return res.render("watch", { pageTitle: `Watching` });
};

// getEdit : 화면에 보여주는 역할
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};

// postEdit : 변경사항을 저장해주는 역할
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // const title = req.body.title 과 같은 의미
  return res.redirect(`/videos/${id}`); // 브라우저가 설정한 주소로 redirect(자동으로 이동)된다.
};

export const getUpload = (req, res) => {
  // 비디오 영상을 하나 더 업로드
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // 위에서 업로드한 비디오를 videos array에 추가
  const { title } = req.body;

  return res.redirect("/");
};
