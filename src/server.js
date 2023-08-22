import express from "express";

const PORT = 4000;

const app = express(); // application을 만들기

// express와 연과된 코드들은 express application을 만들어진 후에 코드를 작성해야 한다.
// application을 만들고 외부접속을 listen하는 가운데 부분에 application을 설정을 한다.

// app.get("어떤 route", callback 함수) 이때, callback은 반드시 함수로 보내야 한다.

// express의 route handler에서는 req, res object를 받아올 수 있다. (바닐라JS에서 event를 받아왔던 것처럼)
const handleHome = (req, res) => {
  return res.end(); // request를 종료하는 응답을 return
};

const handleLogin = (req, res) => {
  return res.send("<h1>Login here.</h1>"); // 해당 내용을 화면에 보내는 응답을 return
};
app.get("/", handleHome);
app.get("/login", handleLogin);

// 위의 내용을 app.get("/", () => console.log("Somebody is trying to go home.")); 로 적는 것도 가능하다.

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening); // 외부접속을 listen
