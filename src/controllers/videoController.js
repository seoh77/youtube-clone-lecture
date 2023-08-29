// 진짜 DB를 사용하기 전, 우선 가짜 DB(=Array DB)를 사용해서 방법 익히기
const videos = [
  {
    title: "Video #1",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 1,
    id: 1,
  },
  {
    title: "Video #2",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 10,
    id: 2,
  },
  {
    title: "Video #3",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 20,
    id: 3,
  },
];

export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params; // const id = req.params.id를 ES6를 사용하면 const { id } = req.params 으로 나타낼 수 있다.
  const video = videos[id - 1]; // 컴퓨터는 0부터 숫자를 세니까 -1을 해줘야 한다. 아니면 아예 videos object에 id값을 0부터 설정해줘도 된다.
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

// getEdit : 화면에 보여주는 역할
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

// postEdit : 변경사항을 저장해주는 역할
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // const title = req.body.title 과 같은 의미
  videos[id - 1].title = title; // 진짜 DB가 아니라 가짜 DB이기 때문에 우선 이렇게 새로 입력받은 title을 업데이트 해준다.
  return res.redirect(`/videos/${id}`); // 브라우저가 설정한 주소로 redirect(자동으로 이동)된다.
};
