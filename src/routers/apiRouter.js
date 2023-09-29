import express from "express";
import {
  registerView,
  createCommet,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createCommet);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment/delete", deleteComment);

export default apiRouter;
