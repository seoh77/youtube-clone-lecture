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
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
    // video가 null이면 여기서 실행을 멈춰야 하니끼 꼭 앞에 return을 붙여야 한다. 안 그러면 그 밑에 코드들도 이어서 실행시킨다.
  }
  return res.render("watch", { pageTitle: video.title, video });
};

// getEdit : 화면에 보여주는 역할
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

// postEdit : 변경사항을 저장해주는 역할
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  video.title = title;
  video.description = description;
  video.hashtags = hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`)); // 만약 단어가 #으로 시작한다면 단어 그대로 return하고, #으로 시작하지 않을 때만 앞에 #을 붙여준다.
  await video.save();
  return res.redirect(`/videos/${id}`);
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
