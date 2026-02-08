import { Router } from "express";
import * as US from './user.service.js'
import { auth } from "../../middleware/auth.middleware.js";
const userRouter = Router()

userRouter.post('/signup', US.signUp)
userRouter.post('/signin', US.signIn)
userRouter.patch('/', auth, US.updateUser)
userRouter.delete('/', auth, US.deleteUser)
userRouter.get('/', auth, US.getLoggedInUser)


export default userRouter;