import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware) // all(미들웨어명)을 사용하면 get, post 등 어떤 HTTP method를 사용하든지 해당 미들웨어를 사용하겠다는 것을 의미한다.
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
// input으로 avatar 파일을 받아서 그 파일을 uploads 폴더에 저장한 다음 그 파일 정보를 postEdit에 전달
// middleware은 왼쪽에서 오른쪽 순서로 작동하여 multer middleware가 먼저 실행되고, 그 다음 postEdit이 실행된다.
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;
