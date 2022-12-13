import jwt from "jsonwebtoken";
import User from "../schemas/user.js";
import {
  registerNewUser,
  loginUser,
  logoutUser,
  updateUser,
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

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
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

export const updateStatus = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await updateUser(_id, req.body);
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
