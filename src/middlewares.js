import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});


// process.env.NODE_ENV === "production" 라면 Heroku에 있다는 것을 의미
// 강의에서는 Heroku를 사용하지만 나는 koyeb을 사용해서 배포하였기 때문에 'isHeroku' 변수명을 isProduction으로 변경
const isProduction = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "youtube-clone-lecture/images",
  acl: "public-read",
});


const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "youtube-clone-lecture/videos",
  acl: "public-read",
});

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isProduction = isProduction;
  next();
};

// 로그인하지 않은 user가 로그인해야 접근할 수 있는 URL에 접근하는 것을 막기 위한 middleware
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

// 이미 로그인 한 user가 로그인 페이지와 같이 로그인하지 않은 사람들을 위한 URL에 접근하는 것을 막기 위한 middleware
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    // 이전 코드는 그냥 홈화면으로 바로 redirect 시켰는데, 사용자에게 메시지를 함께 보내는 것이 좋을 것 같음 => Flash Message 사용
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isProduction ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  storage: isProduction ? s3VideoUploader : undefined,
});

// limits: { fileSize : } 를 통해 해당 용량보다 큰 파일은 업로드가 불가능하도록 설정
