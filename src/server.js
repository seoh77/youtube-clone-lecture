import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter); // 누군가가 "/videos"로 시작하는 url에 접근하면 videoRouter에 있는 컨트롤러를 찾게 하는 역할
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
