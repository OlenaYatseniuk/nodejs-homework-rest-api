import jwt from "jsonwebtoken";
import User from "../schemas/user.js";
import { createError } from "../utils/createError.js";
import RevokedToken from "../schemas/revokedToken.js";

export const auth = async (req, _, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw createError(401, "not a bearer token");
    }
    if (!token) {
      return res.status(401).json({
        message: "Please, provide token",
      });
    }
    const secret = process.env.SECRET_KEY;
    const data = jwt.verify(token, secret);

    if (!data) {
      throw createError(401);
    }

    req.token = token;
    const user = await User.findById(data._id);

    if (!user) {
      throw createError(404);
    }
    req.user = user;

    const revokedToken = await RevokedToken.findOne({ token });

    if (revokedToken) {
      throw createError(401);
    }
    next();
  } catch (e) {
    next(createError(401, e.message));
  }
};
