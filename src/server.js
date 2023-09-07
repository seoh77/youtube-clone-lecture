import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// 아래 middleware가 form을 이해하고 그것들을 자바스크립트로 변형시켜줘서 우리가 사용할 수 있도록 만들어주는 역할을 한다.
app.use(express.urlencoded({ extended: true }));

// express-session middleware가 사이트로 들어오는 모두를 기억하게 될 것이다. (로그인을 하지 않았더라도)
// express-session middleware를 router 앞에서 초기화 해줘야 한다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, // 터미널에서 정의되지 않았다고 뭐가 떠서 추가해줌
    saveUninitialized: false, // 세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨준다.
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localMiddleware); // localMiddleware은 반드시 session middleware 뒤에 와야 정상적으로 session object에 접근할 수 있다.
app.use("/uploads", express.static("uploads")); // Express에게 만약 누군가 /uploads로 가려고 한다면, uploads 폴더의 내용을 보여주라고 설정 (이걸 안하면 404에러가 뜸)
// 위 방식의 문제점 : 서버에 파일을 저장하므로 서버가 종료되면 파일이 사라진다. -> 나중에는 파일을 우리 서버에 저장하는 것이 아니라 다른 곳에 저장하는 방식으로 수정할 것이다.

app.use("/", globalRouter);
app.use("/videos", videoRouter); // 누군가가 "/videos"로 시작하는 url에 접근하면 videoRouter에 있는 컨트롤러를 찾게 하는 역할
app.use("/users", userRouter);

export default app;
// server.js는 express된 것들과 sever의 configuration에 관련된 코드만 처리해주기 위해서 init.js와 나눠서 정리해줌
// database나 models 같은 것들을 import하는 건 init.js에서 진행
