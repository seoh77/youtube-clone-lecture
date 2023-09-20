import mongoose, { mongo } from "mongoose";

// model의 형태 정의 (데이터 형식 지정) = schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 5 },
  createdAt: { type: Date, required: true, default: Date.now }, // Date.now()로 적게되면 함수가 바로 실행되니 Date.now라고 적어야 한다. 그러면 mongoose와 MongoDB가 알아서 처리해준다.
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  // Video Model과 User Model을 연결하는 작업 (id를 가지고)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Video 모델의 function을 직접 만드는 것 -> 다른 파일에서 'Video.함수명'으로 사용할 수 있다.
// videoSchema.static('static 이름', 함수)
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
// Video만 import하면 formatHashtags도 함께 사용할 수 있다. 굳이 따로 import 할 필요 없음.

// model 만들기 = mongoose.model("model 이름", 데이터 형태인 schema)
const Video = mongoose.model("Video", videoSchema);

export default Video;
