import {Router} from "express";

import { auth } from "../../middleware/auth.js";
import {userSchema, validateData} from '../../middleware/validator.js';
import {register, login, logout, getCurrentUser} from '../../controllers/user.js';

const authRouter = Router();

authRouter.post("/signup",validateData(userSchema), register);
authRouter.post("/login", validateData(userSchema), login);
authRouter.get("/logout", auth, logout)
authRouter.get("/current", auth, getCurrentUser);

export default authRouter;