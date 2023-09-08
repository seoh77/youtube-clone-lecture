// 이 파일은 굉장히 오래된 JavaScript 코드만 이해할 수 있다.

// 2가지 필수 요건 -> 이때 이름은 entry와 output으로 고정되어 있다.
// 1. entry (= 우리가 처리하고자 하는 파일들) 의 경로 적어주기
// 2. output (= 결과물) 의 파일명과 경로 설정

const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js", // 우리가 변경하고자 하는 파일의 경로를 적어주면 된다.
  mode: "development", // webpack에게 아직 코드가 개발 중임으로 알려줌 (따로 설정해주지 않으면 production mode로 설정되고, 코드를 전부 압축시킴)
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"), // 여기서 path는 절대경로로 적어줘야 한다.
  }, // 결과물을 위한 파일명과 경로 설정
  module: {
    // rules는 우리가 각각의 파일 종류에 따라 어떤 전환을 할 건지 결정하는 것
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};

// dirname(=directory name)은 파일까지의 경로 전체를 말한다.
// path.resolve()는 괄호 안에 있는 내용들을 묶어서 하나의 경로로 만들어 준다.
// 예를 들어 path.resolve(__dirname, "assets", "js")는 '/Users/seoh/Desktop/study/nomad-web-study/youtube-clone/assets/js'가 된다.
