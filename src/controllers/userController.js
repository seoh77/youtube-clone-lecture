import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";

  // 비밀번호 확인을 위해 비밀번호를 두 번 입력하고, 그 두 개의 값이 같은지 확인
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmaiton does not match.",
    });
  }

  // 이미 사용 중인 username 또는 email을 체크하는 작업
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }

  // 위에서 에러를 직접 처리하긴 했지만, 생각하지 못한 에러가 남아있을 수도 있으니 try-catch를 사용해서 에러를 대비해야한다.
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  // 비밀번호 맞게 입력했는지 확인
  const ok = await bcrypt.compare(password, user.password); // bcrypt.compare(로그인에서 입력된 password, DB에 저장되어있는 password)
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }

  // 세션에 정보 추가 (세션을 initialize(초기화))
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT, // client_id가 비밀은 아니지만 값을 한 장소에 넣어놓고 어디서든지 사용하기 위해서 .env 파일에 저장해뒀다.
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString(); // 위에 있는 config를 결합해서 하나의 URL처럼 만들어준다.
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, // GitHub에서 코드를 URL에 넣어서 보내준다.
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    // access api
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // email 정보가 private으로 되어 있어서 null값으로 가져와졌다. 그래서 따로 추가 작업을 해줘야 한다.
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // primary 와 verified 둘 다 true인 email을 찾아야 한다.
    const emailObj = emailData.find(
      (email) => (email.primary === true) & (email.verified === true)
    );
    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req; // const id = req.session.user.id; const { name, email, username, location } = req.body; 두 줄을 적는 것과 위의 방식은 동일
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.location : avatarUrl, // user가 file을 업로드 하면 file path로 avatar를 변경하고, file을 업로드 하지 않으면 기존 avatar을 그대로 유지
      name,
      email,
      username,
      location,
    },
    { new: true } // new:true를 설정해줘야 findByIdAndUpdate가 업데이트 된 데이터를 return 해준다.
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  // 어떤 user의 비밀번호를 변경시킬지 알고, 그 user에게 저장해야 save할 때 비밀번호가 hash되는 함수가 정상적으로 작동한다.
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  // user 본인 뿐만 아니라 누구나 볼 수 있도록 만들어야 하기 때문에 req.session.user._id로 id를 가져오지 않고, url에서 id를 가져온다.
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", { pageTitle: user.name, user });
};
