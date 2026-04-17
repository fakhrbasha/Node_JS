import { Router } from "express";
import UserService from "./user.service";
import * as userValidation from "./user.validation";
import { validation } from "../../common/middleware/validation";
import { authentication } from "../../common/middleware/authentication";
import { auth } from "google-auth-library";
const authRouter = Router();


authRouter.post('/signup', validation(userValidation.signUpSchema), UserService.signup);
authRouter.post('/confirm-email', validation(userValidation.confirmEmailSchema), UserService.confirmEmail);
authRouter.post('/signin', validation(userValidation.signInSchema), UserService.signin);
authRouter.post('/signup/gmail', UserService.signinWithGoogle)
authRouter.post('/update-password', validation(userValidation.updatePasswordSchema), authentication, UserService.updatePassword);
authRouter.post('/forgot-password', validation(userValidation.forgotPasswordSchema), UserService.forgetPassword);
authRouter.post('/reset-password', validation(userValidation.resetPasswordSchema), UserService.resetPassword);
authRouter.post('/logout', authentication, UserService.logOut);

export default authRouter;