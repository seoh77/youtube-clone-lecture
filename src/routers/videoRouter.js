import express from "express";
import {
  upload,
  getEdit,
  deleteVideo,
  watch,
  postEdit,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); // '\d+'는 id값을 숫자로 제한하는 역할을 한다.
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); // 위의 두 줄을 한 번에 표현할 수 있는 방법

export default videoRouter;
