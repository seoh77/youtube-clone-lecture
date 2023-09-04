import express from "express";
import {
  getEdit,
  watch,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch); // 랜덤으로 부여되는 Id값에 숫자+문자가 섞여 있어서 기존의 (\\d+) 정규식으로는 정상 실행되지 않는다. 따라서 24글자가 0-9, a-f로 구성되어 있는지를 확인하는 정규식을 새로 만들었다.
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
