import express from "express";
import { watch, eidt } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/eidt", eidt);

export default videoRouter;
