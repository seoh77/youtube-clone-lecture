// 1. "express"라는 패키지를 express라는 이름으로 import
import express from "express"; // -> 이렇게만 입력해도 NodeJS와 npm은 'node_modules에 있는 express를 찾고있다는 것을 알고있다. 따라서 굳이 "node_modules/express"라고 적을 필요가 없다.

const PORT = 4000;

// 2. express application 만들기 -> express 설계를 위한 규칙!
const app = express();
// 반드시 변수명을 app으로 할 필요는 없지만, 관습적으로 app을 사용한다.
// express function을 사용하면 express application을 생성해준다.

// 3. app.listen(listening 할 port 번호, callback)
// 서버에게 어떤 port를 listening 할 지 이야기해줘야 한다. -> 컴퓨터에는 수많은 port가 있고, 몇몇 port들은 인터넷에 오픈되어 있다. 그리고 보통 높은 숫자의 port들은 비어있다.
// callback : 서버가 시작될 때 작동하는 함수

const handleListening = () =>
  console.log(`Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

// 위의 내용을 app.listen(4000, () => console.log("Server listenting on port 4000 🚀")); 이렇게 줄일 수도 있다.

// 이렇게 하면 서버가 만들어지고, 그 서버가 port 4000을 listening 하고 있다.
