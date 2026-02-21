import { Router } from "express";
import * as US from './user.service.js'
import { authentication } from "../../middleware/authontication.js";
import { authorization } from "../../middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
const userRouter = Router()

userRouter.post('/signup', US.signUp)
userRouter.post('/signup/gmail', US.signUpWithGmail)
userRouter.post('/signin', US.signIn)
userRouter.get('/profile', authentication, authorization(RoleEnum.user), US.getProfile)
// if make authorization empty apply to user and admin


export default userRouter;