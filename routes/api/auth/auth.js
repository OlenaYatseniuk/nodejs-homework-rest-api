import {Router} from "express";

import { auth } from "../../../middleware/auth.js";
import {userSchema, validateData, userSubscription} from '../../../middleware/validator.js';
import {register, login, logout, getCurrentUser, updateUserStatus, updateUserAvatar} from '../../../controllers/user.js';
import {upload} from '../../api/uploadsRouter.js'

const authRouter = Router();

authRouter.post("/signup",validateData(userSchema), register);
authRouter.post("/login", validateData(userSchema), login);
authRouter.use(auth)
authRouter.get("/logout", logout)
authRouter.get("/current", getCurrentUser);
authRouter.patch('/', validateData(userSubscription), updateUserStatus)

authRouter.patch('/avatars', upload.single('avatar'), updateUserAvatar)

export default authRouter;