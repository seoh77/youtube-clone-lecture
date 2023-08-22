import express from "express";
import morgan from "morgan"; // "morgan"으로 부터 import만 해온다면 이름은 뭐로 설정하든 상관없다.

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const home = (req, res) => {
  console.log("I will respond.");
  return res.send("hello");
};

const login = (req, res) => {
  return res.send("login");
};

app.use(logger);
//  app.use(morgan("dev")) 이런 식으로 따로 변수를 선언하지 않고 한 번에 적어 사용할 수도 있다.

app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
