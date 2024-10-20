const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const client_id = process.env.GG_CLIENTID;
const client = new OAuth2Client(client_id);
const User = require("../models/UserModel");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "the input reuired",
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "the input email",
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "the input password",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//a
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const response = await UserService.loginUser(req.body);
    if (!response || response.status === "ERR") {
      return res.status(400).json({ status: 400, message: "Login fail" });
    }
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...newReponse, refresh_token });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const file = req.file;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const upload = await UserService.uploadImage(file);
    data.avatar = upload.url;
    console.log(file);
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await UserService.softDeleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const filter = req.query;
    let response;
    if (filter.length > 0) {
      response = await UserService.getAllUser(filter);
    } else {
      response = await UserService.getAllUser();
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await UserService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshToken(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout success",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getFollower = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await UserService.getFollower(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const addFollower = async (req, res) => {
  try {
    const { senderId, reciverId } = req.body;
    if (!senderId) {
      return res.status(400).json({
        status: "ERR",
        message: "the senderId is required",
      });
    }
    if (!reciverId) {
      return res.status(400).json({
        status: "ERR",
        message: "the reciverId is required",
      });
    }
    const response = await UserService.addFollower(senderId, reciverId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getUserInMessage = async (req, res) => {
  try {
    const filter = req.query;
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await UserService.getUserInMessage(userId, filter);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const verifyTokenGG = async (req, res) => {
  try {
    const body = req.body;
    const ticket = await client.verifyIdToken({
      idToken: body.token,
      audience: client_id,
    });
    const data = ticket.getPayload();
    const createUser = await UserService.createUser({
      name: data.name,
      email: data.email,
      password: "12345678",
      confirmPassword: "12345678",
    });
    if (createUser.message === "the email is already") {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        res.status(400).json("Login fail");
      }
      if (!user?.avatar) {
        await UserService.updateUser(user._id, { avatar: data.picture });
      }
      const response = await UserService.loginUser({
        email: data.email,
        password: "",
        gg_password: user.password,
      });
      if (!response || response.status === "ERR") {
        return res.status(400).json({ status: 400, message: "Login fail" });
      }
      const { refresh_token, ...newReponse } = response;
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
      return res.status(200).json({ ...newReponse, refresh_token });
    }
  } catch (e) {
    return e;
  }
};

const verifyTokenFb = async (req, res) => {
  try {
    const body = req.body;
    const createUser = await UserService.createUser({
      name: body.name,
      email: body.email,
      password: "12345678",
      confirmPassword: "12345678",
    });
    if (createUser.message === "the email is already") {
      const user = await User.findOne({ email: body.email });
      if (!user) {
        res.status(400).json("Login fail");
      }
      if (!user?.avatar) {
        await UserService.updateUser(user._id, { avatar: body.picture });
      }
      const response = await UserService.loginUser({
        email: body.email,
        password: "",
        gg_password: user.password,
      });
      if (!response || response.status === "ERR") {
        return res.status(400).json({ status: 400, message: "Login fail" });
      }
      const { refresh_token, ...newReponse } = response;
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
      return res.status(200).json({ ...newReponse, refresh_token });
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  softDeleteUser,
  refreshToken,
  logoutUser,
  getFollower,
  addFollower,
  getUserInMessage,
  verifyTokenGG,
  verifyTokenFb,
};
