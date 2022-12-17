import jwt from "jsonwebtoken";
import gravatar from 'gravatar';
import Jimp from 'jimp';
import * as path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";
import User from "../schemas/user.js";
import {
  registerNewUser,
  loginUser,
  logoutUser,
  updateUserSubscription,
} from "../services/user.js";
import { createError } from "../utils/createError.js";
import RevokedToken from "../schemas/revokedToken.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await registerNewUser(email, password);

    if (!user) {
      throw createError(
        409,
        "Such email has already exist! Try another one, please!"
      );
    }
    const avatar = gravatar.url('emerleite@gmail.com')
    console.log("avatar",avatar)

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }, "password");

    if (!user) {
      throw createError(404);
    }
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw createError(401, "Email or password is wrong");
    }

    const payload = {
      _id: user._id,
    };
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret, { expiresIn: "12h" });

    const loginedUser = await loginUser(email, token);

    res.json({
      token: token,
      user: {
        email: loginedUser.email,
        subscription: loginedUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  const userId = req.user.id;
  const token = req.token;

  try {
    const user = await logoutUser(userId);

    if (!user) {
      throw createError(401);
    }

    await RevokedToken.create({ token, userId });
    res.send('token revoked')
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser = async (req, res, next) => {
  res.json({
    user: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

export const updateUserStatus = async (req, res, next) => {
    const userId = req.user.id;
  try {
    const user = await updateUserSubscription(userId, req.body);
    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  const userId = req.user.id;
  const { originalname, path: tempPath } = req.file;
  const uniqueName = userId + "-" + originalname;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const newPath = path.join(__dirname, "../public/avatars", uniqueName);
  const avatarURL = `http://${process.env.HOST}:${process.env.PORT}/avatars/${uniqueName}`;

  try {
      const avatar = await Jimp.read(tempPath);
      avatar.resize(250, 250);
      avatar.write(tempPath);

      await fs.rename(tempPath, newPath);
      await User.findOneAndUpdate({ email: req.user.email }, { avatarURL });

      res.json({
          avatarURL: avatarURL,
      });
  } catch (e) {
      await fs.unlink(tempPath);
      next(e);
  }
};
