import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique를 사용해서 중복이 되지 않도록 설정
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

// save(저장)하기 전에 비밀번호를 해싱하는 과정
userSchema.pre("save", async function () {
  // 여기서 this는 새로 creat되는 user을 가리킨다.
  this.password = await bcrypt.hash(this.password, 5); // 5는 5번 해싱을 진행한다는 것을 의미
});

const User = mongoose.model("User", userSchema);
export default User;
