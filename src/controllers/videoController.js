import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "asc" }); // sort를 추가해서 정렬 방법을 설정할 수 있다. asc(오름차순) / desc(내림차순)
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; // const id = req.params.id를 ES6를 사용하면 const { id } = req.params 으로 나타낼 수 있다.
  // findOne : 입력한 모든 조건을 적용시켜서 조건을 충족하는 요소를 찾을 수 있다.  -> 예를 들어 조회수가 25인 영상을 찾아라
  // findById : id로 해당 요소를 찾아낼 수 있는 기능
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
    // video가 null이면 여기서 실행을 멈춰야 하니끼 꼭 앞에 return을 붙여야 한다. 안 그러면 그 밑에 코드들도 이어서 실행시킨다.
  }
  return res.render("watch", { pageTitle: video.title, video });
};

// getEdit : 화면에 보여주는 역할
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

// postEdit : 변경사항을 저장해주는 역할
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); // 굳이 모든 Video를 가져와 검색하지 않고 exists(조건)함수를 사용하면 간단하게 처리할 수 있다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
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
      hashtags: Video.formatHashtags(hashtags),
    });
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
