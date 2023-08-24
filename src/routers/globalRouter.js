import express from "express"; // server.js에서 import 했더라도 globalRouter.js에서 사용한다면 다시 import 해줘야 한다.
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";
// 이때 default export 와 달리 이름을 바꾸면 안되고, export 할 때 사용했던 이름 그대로 사용해야 한다.

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter; // 누구든 globalRouter.js를 import하면, globalRouter 자체를 import 하게 된다.
