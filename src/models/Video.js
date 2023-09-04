import mongoose from "mongoose";

// model의 형태 정의 (데이터 형식 지정) = schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, minLength: 5 },
  createdAt: { type: Date, required: true, default: Date.now }, // Date.now()로 적게되면 함수가 바로 실행되니 Date.now라고 적어야 한다. 그러면 mongoose와 MongoDB가 알아서 처리해준다.
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// middleware은 무조건 model이 생성되기 전에 만들어야 한다.
// save 이벤트에 middleware을 실행시키는 것이기 때문에 update에는 적용X -> 따라서 update를 위한 middlware도 만들어줘야 한다.
videoSchema.pre("save", async function () {
  // 여기서 this는 저장하고자 하는 문서를 가리킨다.
  // console.log(this)를 해보면 hashtags 배열의 첫 번째 요소 값에 유저가 입력한 값 전체에 들어가있는 것을 확인할 수 있다.
  // 따라서 첫 번째 값을 받아서 콤마(,)를 기준으로 나누고 단어의 앞 글자가 #이 아니라면 #을 붙여준다.
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// model 만들기 = mongoose.model("model 이름", 데이터 형태인 schema)
const Video = mongoose.model("Video", videoSchema);

export default Video;
