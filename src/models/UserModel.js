const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    phone: { type: Number },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
    isDelete: { type: Boolean, default: false, required: true },
    follow: { type: Array },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
