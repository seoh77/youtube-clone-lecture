import express from "express";
import {
  upload,
  edit,
  deleteVideo,
  watch,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); // '\d+'는 id값을 숫자로 제한하는 역할을 한다.
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload); // 정규식을 사용하여 이젠 :id 아래에 /upload가 있어도 문제없다.

export default videoRouter;
