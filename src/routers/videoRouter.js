import express from "express";
import {
  getEdit,
  watch,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch); // 랜덤으로 부여되는 Id값에 숫자+문자가 섞여 있어서 기존의 (\\d+) 정규식으로는 정상 실행되지 않는다. 따라서 24글자가 0-9, a-f로 구성되어 있는지를 확인하는 정규식을 새로 만들었다.
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
// upload.pug에서 video와 thumb 2개의 파일을 보내기 때문에 기존에 쓴 single로는 처리할 수 없다.
// 여러개를 보내기 위해서는 fields를 사용해야 한다.

export default videoRouter;
