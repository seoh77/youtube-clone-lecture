import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
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
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});

// limits: { fileSize : } 를 통해 해당 용량보다 큰 파일은 업로드가 불가능하도록 설정
