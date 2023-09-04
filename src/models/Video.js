import mongoose from "mongoose";

// model의 형태 정의 (데이터 형식 지정) = schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

// model 만들기 = mongoose.model("model 이름", 데이터 형태인 schema)
const Video = mongoose.model("Video", videoSchema);

export default Video;
