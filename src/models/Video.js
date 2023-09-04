import mongoose from "mongoose";

// model의 형태 정의 (데이터 형식 지정) = schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, // Date.now()로 적게되면 함수가 바로 실행되니 Date.now라고 적어야 한다. 그러면 mongoose와 MongoDB가 알아서 처리해준다.
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// model 만들기 = mongoose.model("model 이름", 데이터 형태인 schema)
const Video = mongoose.model("Video", videoSchema);

export default Video;
