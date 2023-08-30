import mongoose from "mongoose";

// 터미널에서 mongosh를 실행했을 때 얻을 수 있는 connecting url을 입력한 후에 database 이름을 적어주면 된다.
mongoose.connect("mongodb://127.0.0.1:27017/youtube");

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error ", error);

// database에서 error가 발생하면 어떤 error인지 console에 표시된다.
db.on("error", handleError);

// database에서 발생할 수 있는 또 다른 event는 database로의 connection을 여는 것도 있다.
//  -> connection이 열린다는 것은 database에 연결되었다는 것을 의미한다.
db.once("open", handleOpen);

// on VS once
// on은 여러 번 계속 발생시킬 수 있지만, once는 오로지 한 번만 발생한다.
