const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("../services/JwtService");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const client_id = process.env.GG_CLIENTID;
const client = new OAuth2Client(client_id);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const verifyTokenGG = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id,
    });
  } catch (e) {
    return e;
  }
};

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "the email is already",
        });
      }
      if (password !== confirmPassword) {
        resolve({
          status: "ERR",
          message: "the password fail",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createUser,
        });
      }
      resolve({});
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, gg_password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "the email is not defined",
        });
      }
      if (password !== "" && !gg_password) {
        const comparePassword = bcrypt.compareSync(
          password,
          checkUser.password
        );
        if (!comparePassword) {
          resolve({
            status: "ERR",
            message: "the password is incorrect",
          });
        }
      }
      if (password === "" && gg_password) {
        if (gg_password !== checkUser.password) {
          resolve({
            status: "ERR",
            message: "the password is incorrect",
          });
        }
      }
      if (
        (password === "" && !gg_password) ||
        (password !== "" && gg_password)
      ) {
        resolve({
          status: "ERR",
          message: "the password is incorrect",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "404",
          message: "the user is not defined",
        });
      }
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const uploadImage = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        return resolve({
          status: "404",
          message: "no image file provided",
        });
      }
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, result) => {
          if (error) {
            return resolve({
              status: "404",
              message: "upload file failed",
            });
          }
          return resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        })
        .end(file.buffer);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "404",
          message: "the user is not defined",
        });
      }
      const deleteUser = await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const softDeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "404",
          message: "the user is not defined",
        });
      }
      const softDeleteUser = await User.findByIdAndUpdate(id, {
        isDelete: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalUser = await User.countDocuments();
      if (filter) {
        const objectFilter = {};
        objectFilter[filter[1]] = filter[0];
        const lable = filter[0];
        const getAllUserFilter = await User.find({
          isDelete: false,
          [lable]: { $regex: filter[1] },
        });
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: getAllUserFilter,
          total: totalUser,
        });
      }
      const getAllUser = await User.find({ isDelete: false });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: getAllUser,
        total: totalUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "404",
          message: "the user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getFollower = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getUser = await User.findOne({ _id: id });
      if (!getUser?.isAdmin) {
        const listFollower = Promise.all(
          getUser?.follow.map(async (fl) => {
            const follower = await User.findOne({ isDelete: false, _id: fl });
            return {
              id: follower._id,
              email: follower.email,
              name: follower.name,
              avatar: follower?.avatar,
            };
          })
        );
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: await listFollower,
        });
      } else {
        const getAllUser = await User.find({ isDelete: false });
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: getAllUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const addFollower = async (senderId, reciverId) => {
  try {
    await User.findByIdAndUpdate(
      { _id: senderId },
      { $push: { follow: [reciverId] } }
    );
    return { status: 200, message: "Follower created succesfully" };
  } catch (error) {
    console.log("Error", error);
  }
};

const getUserInMessage = async (id, filter = {}) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return {
        status: "404",
        message: "The user is not defined",
      };
    }

    const follower = await getFollower(id);

    if (Object.keys(filter).length === 0) {
      follower.data = await findUserInMessage(filter, !user.isAdmin);
    } else {
      const userHasFound = await findUserInMessage(filter, !user.isAdmin);
      follower.data.push(userHasFound);
    }

    return follower;
  } catch (e) {
    return {
      status: "ERROR",
      message: e.message,
    };
  }
};

const findUserInMessage = async (filter = {}, isAdmin) => {
  try {
    const query = {
      isDelete: false,
    };

    if (Object.keys(filter).length > 0) {
      const filterKeys = Object.keys(filter).map((key) => ({
        name: { $regex: filter[key] },
      }));
      query.$or = filterKeys;
    }
    if (isAdmin === true) {
      query.isAdmin = isAdmin;
    }

    return await User.find(query);
  } catch (e) {
    throw new Error(`Error finding users: ${e.message}`);
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  uploadImage,
  deleteUser,
  getAllUser,
  getDetailUser,
  softDeleteUser,
  getFollower,
  addFollower,
  getUserInMessage,
};
