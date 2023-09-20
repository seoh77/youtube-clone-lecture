import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; // const id = req.params.id를 ES6를 사용하면 const { id } = req.params 으로 나타낼 수 있다.
  // findOne : 입력한 모든 조건을 적용시켜서 조건을 충족하는 요소를 찾을 수 있다.  -> 예를 들어 조회수가 25인 영상을 찾아라
  // findById : id로 해당 요소를 찾아낼 수 있는 기능
  const video = await Video.findById(id).populate("owner").populate("comments"); // populate는 실제 User 데이터로 채워주는 역할을 한다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
    // video가 null이면 여기서 실행을 멈춰야 하니끼 꼭 앞에 return을 붙여야 한다. 안 그러면 그 밑에 코드들도 이어서 실행시킨다.
  }
  return res.render("watch", { pageTitle: video.title, video });
};

// getEdit : 화면에 보여주는 역할
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

// postEdit : 변경사항을 저장해주는 역할
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); // 굳이 모든 Video를 가져와 검색하지 않고 exists(조건)함수를 사용하면 간단하게 처리할 수 있다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  // 비디오 영상을 하나 더 업로드
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  // single을 사용했을 때는 req.file로 file을 받아오지만, fields를 쓰면 req.files를 사용한다.
  // 여기서 req.files는 video와 thumb의 정보를 가진 객체이다.
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title, // title : title 로 적는 것과 같은 의미다.
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    console.log(thumbUrl);
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    // DB를 저장하는 과정에서 에러가 발생하면 아래 내용이 수행된다.
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  // findOneAndDelete와 findOneAndRemove는 약간 다른점이 있긴 하지만, 쓰면 안 되는 특별한 이유가 있지 않는 이상 findOneAndDelete를 사용한다.
  // findByIdAndDelete(id)는 findOneAndDelete({_id:id})를 간단하게 줄인 것이다.
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        // $regex: new RegExp(keyword)를 사용함으로써 keyword를 포함한 단어는 모두 검색 된다.
        // 여기서 i는 대문자와 소문자를 구분하지 않도록 한다. (Weclome이나 weclome이나 모두 검색되도록)
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
    // status만 사용하면 아무것도 return하지 않은 것이다.
    // 따라서 render을 사용하지 않고 status만 보내고 싶다면 sendStatus를 사용해야 연결을 끝낼 수 있다.
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createCommet = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
