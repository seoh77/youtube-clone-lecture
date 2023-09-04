import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// 아래 middleware가 form을 이해하고 그것들을 자바스크립트로 변형시켜줘서 우리가 사용할 수 있도록 만들어주는 역할을 한다.
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/videos", videoRouter); // 누군가가 "/videos"로 시작하는 url에 접근하면 videoRouter에 있는 컨트롤러를 찾게 하는 역할
app.use("/users", userRouter);

export default app;
// server.js는 express된 것들과 sever의 configuration에 관련된 코드만 처리해주기 위해서 init.js와 나눠서 정리해줌
// database나 models 같은 것들을 import하는 건 init.js에서 진행
