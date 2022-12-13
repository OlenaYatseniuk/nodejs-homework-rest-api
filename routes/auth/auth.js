import {Router} from "express";

import { auth } from "../../middleware/auth.js";
import {userSchema, validateData, userSubscription} from '../../middleware/validator.js';
import {register, login, logout, getCurrentUser, updateUserStatus} from '../../controllers/user.js';

const authRouter = Router();

authRouter.post("/signup",validateData(userSchema), register);
authRouter.post("/login", validateData(userSchema), login);
authRouter.use(auth)
authRouter.get("/logout", logout)
authRouter.get("/current", getCurrentUser);
authRouter.patch('/', validateData(userSubscription), updateUserStatus)

export default authRouter;