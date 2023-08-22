import express from "express";

const PORT = 4000;

const app = express();

// 사실 controller에는 req, res 외에 next라는 argument도 있으며, 이는 다음 함수를 호출해주는 역할을 한다.
const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to: ${req.url}`);
  // return res.send("lalala") -> 만약 이렇게 next() 전에 return 된다면 next()는 실행되지 않아 handleHome 함수도 실행되지 않는다.
  next();
};

const handleHome = (req, res) => {
  return res.end();
};

const handleLogin = (req, res) => {
  return res.send("<h1>Login here.</h1>");
};

app.get("/", gossipMiddleware, handleHome); // gossipMiddleware controller에 next()가 있기 때문에 gossipMiddleware가 실행된 후 그 다음 함수인 handleHome이 실행됨
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
