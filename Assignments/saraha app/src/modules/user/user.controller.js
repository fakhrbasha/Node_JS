import { Router } from "express";
import * as US from './user.service.js'
import { authentication } from "../../middleware/authontication.js";
import { authorization } from "../../middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { multer_host, multer_local } from "../../middleware/multer.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import { confirmEmailSchema, shareProfileSchema, signInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
const userRouter = Router()
// [ [] , [] ] spreed multer enum to contain in one array

// userRouter.post('/signup', multer_local({ custom_path: "users", custom_type: [...multer_enum.image] }).single("avatar"), US.signUp)


// userRouter.post('/signup',
//     multer_host({ custom_type: [...multer_enum.image] }).single("avatar"),
//     validation(signUpSchema),
//     US.signUp) // for cloudinary because it need path to upload file and multer_host return storage in memory storage and multer_local return storage in disk storage

// must use validation after multer

// userRouter.post('/signup', multer_local({ custom_path: "users", custom_type: [...multer_enum.image, ...multer_enum.pdf] }).array("avatars", 2 /* max count */), US.signUp) // to upload multiple files and in postman send key avatar and select multiple files


// userRouter.post('/signup', multer_host({ custom_type: [...multer_enum.image] }).fields([
//     { name: "profile_picture", maxCount: 1 },
//     { name: "cover_photos", maxCount: 2 }
// ]), US.signUp)  // to upload multiple files with different keys and in postman send key avatar and select multiple files and send another key coverPhotos and select multiple files


userRouter.post('/signup', validation(signUpSchema), US.signUp)

userRouter.post("/upload-images", multer_host({
    custom_type: [...multer_enum.image]
}).fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "cover_photos", maxCount: 2 }
]), authentication, US.uploadImages)

userRouter.post('/signup/gmail', US.signUpWithGmail)
userRouter.post('/confirm-email', validation(confirmEmailSchema), US.confirmEmail)
userRouter.post('/resend-otp', US.resendOtp)
userRouter.post('/forget-password', US.forgetPassword)
userRouter.post('/reset-password', US.resetPassword)
userRouter.post('/signin', validation(signInSchema), US.signIn)
userRouter.post('/enable-2fa', authentication, US.enable2FA)
userRouter.post('/confirm-2fa', authentication, US.confirm2FA)
userRouter.post('/confirm-login', US.confirmLogin)
userRouter.post('/logout', authentication, US.logout)
userRouter.get('/profile', authentication, authorization(RoleEnum.user), US.getProfile)
userRouter.get('/refresh-token', US.refreshToken)
userRouter.patch('/update-profile', validation(updateProfileSchema), authentication, US.updateProfile)
userRouter.patch('/update-password', validation(updatePasswordSchema), authentication, US.updatePassword)
userRouter.delete(
    "/profile-picture",
    authentication,
    US.removeProfileImage
)
userRouter.get('/share-profile/:id', validation(shareProfileSchema), US.shareProfile)
userRouter.get('/:id/profile', authentication, US.getProfileVisits)

// if make authorization empty apply to user and admin


export default userRouter;