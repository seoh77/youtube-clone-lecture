import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; // const id = req.params.id를 ES6를 사용하면 const { id } = req.params 으로 나타낼 수 있다.
  // findOne : 입력한 모든 조건을 적용시켜서 조건을 충족하는 요소를 찾을 수 있다.  -> 예를 들어 조회수가 25인 영상을 찾아라
  // findById : id로 해당 요소를 찾아낼 수 있는 기능
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title, // title : title 로 적는 것과 같은 의미다.
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`), // 콤마(,)를 기준으로 각 단어를 분리하고 단어 앞에 #을 붙여준다.
    });
    return res.redirect("/");
  } catch (error) {
    // DB를 저장하는 과정에서 에러가 발생하면 아래 내용이 수행된다.
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
