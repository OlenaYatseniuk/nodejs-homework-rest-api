import { Schema, model } from "mongoose";

import bcrypt from "bcryptjs";
const salt = Number(process.env.BCRYPT_SALT);

const user = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

user.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, salt);
};

user.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = model("user", user);

export default User;