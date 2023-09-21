// 이 파일은 굉장히 오래된 JavaScript 코드만 이해할 수 있다.

// 2가지 필수 요건 -> 이때 이름은 entry와 output으로 고정되어 있다.
// 1. entry (= 우리가 처리하고자 하는 파일들) 의 경로 적어주기
// 2. output (= 결과물) 의 파일명과 경로 설정

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    // 우리가 변경하고자 하는 파일의 경로를 적어주면 된다.
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  },
  // 배포 단계 이므로 development이 아닌 production으로 실행할 것이다. -> package.json에서 설정
  // mode: "development", // webpack에게 아직 코드가 개발 중임으로 알려줌 (따로 설정해주지 않으면 production mode로 설정되고, 코드를 전부 압축시킴)
  // watch: true, // 이 부분을 추가해주면 npm run assets를 한 번만 실행시켜도 종료되지 않고 계속 남아있으며 변경 사항이 생기면 refresh와 compile을 다시 해준다.
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    // 결과물을 위한 파일명과 경로 설정
    filename: "js/[name].js", // [name]이라고 적어주면, entry에 있는 이름을 그대로 가져간다.
    path: path.resolve(__dirname, "assets"), // 여기서 path는 절대경로로 적어줘야 한다.
    // dirname(=directory name)은 파일까지의 경로 전체를 말한다.
    // path.resolve()는 괄호 안에 있는 내용들을 묶어서 하나의 경로로 만들어 준다.
    // 예를 들어 path.resolve(__dirname, "assets", "js")는 '/Users/seoh/Desktop/study/nomad-web-study/youtube-clone/assets/js'가 된다.
    clean: true, // output folder를 build 하기 전에 clean해주는 역할을 한다.
  },
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
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // 제일 마지막에 있는 'sass-loader'가 webpack이 가장 먼저 사용할 loader
      },
    ],
  },
};
