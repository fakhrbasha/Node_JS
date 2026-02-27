import { Router } from "express";
import * as US from './user.service.js'
import { authentication } from "../../middleware/authontication.js";
import { authorization } from "../../middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { multer_local } from "../../middleware/multer.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import { signUpSchema } from "./user.validation.js";
const userRouter = Router()
// [ [] , [] ] spreed multer enum to contain in one array
// userRouter.post('/signup', multer_local({ custom_path: "users", custom_type: [...multer_enum.image, ...multer_enum.pdf] }).single("avatar"), US.signUp)
userRouter.post('/signup', validation(signUpSchema), US.signUp)
userRouter.post('/signup/gmail', US.signUpWithGmail)
userRouter.post('/signin', US.signIn)
userRouter.get('/profile', authentication, authorization(RoleEnum.user), US.getProfile)
// if make authorization empty apply to user and admin


export default userRouter;