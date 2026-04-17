import { NextFunction, Request, Response } from "express";
import { ISignUp } from "./user.interfaces";
import { AppError } from "../../common/utils/global-error-handling";
import userModel, { IUser } from "../../DB/models/user.model";
import { HydratedDocument, Model } from "mongoose";
import { ISignUpType } from "./user.validation";
import BaseRepository from "../../DB/repository/base.repository";
import UserRepository from "../../DB/repository/user.repository";
import { encrypt } from "../../common/utils/security/encrypt";
import { Compare, Hash } from "../../common/utils/security/hash";
import { sendEmail, sendOtp } from "../../common/utils/mail/mail";
import { templateEmail } from "../../common/utils/mail/email.template";
import { deleteKey, getValue, otpKey, setValue } from "../../common/utils/redis/redis.service";
import { emailEnum, providerEnum } from "../../common/enum/user.enum";
import { ACCESS_SECRET_KEY } from "../../config/config.service";
import { generateToken } from "../../common/utils/jwt/jwt";
import { OAuth2Client } from "google-auth-library";


class UserService {

    // private readonly _userModel: Model<IUser> = userModel
    // use repository pattern to make the code more maintainable and testable, so that we can easily switch to another database or ORM in the future without changing the business logic of the application.
    // private readonly _userModel = new BaseRepository<IUser>(userModel)
    private readonly _userModel = new UserRepository()





    constructor() { }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        const { username, email, password, confirmPassword, age, gender, address, phone, confirmed = false }: ISignUpType = req.body; // we can use the ISignUp interface to type the request body, so that we can get type checking and autocompletion for the properties of the request body.
        // HydratedDocument mean  : that the document is a mongoose document that has been hydrated with the data from the database, so that we can use the methods and properties of the mongoose document on it.

        const emailExist = await this._userModel.findOne({ filter: { email } })

        if (emailExist) {
            return next(new AppError("Email already exists", 409))
        }

        const user: HydratedDocument<IUser> = await this._userModel.create({
            username
            , email
            , password: Hash({ plan_text: password })
            , age
            , gender
            , address
            , phone: phone ? encrypt(phone) : undefined,
            confirmed
        })

        const otp = await sendOtp()
        await sendEmail({
            to: email,
            subject: "Email confirmation",
            html: templateEmail(otp)
        })
        await setValue({ key: otpKey(email, emailEnum.confirmedEmail), value: Hash({ plan_text: `${otp}` }), ttl: 60 * 5 })

        res.status(200).json({
            message: "User signed up successfully", data: user
        })
    }

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;

        const otpValue = await getValue({
            key: otpKey(email, emailEnum.confirmedEmail)
        });

        if (!otpValue) {
            return next(new AppError("OTP expired", 400));
        }

        if (!Compare({ plan_text: otp, cipher_text: otpValue })) {
            return next(new AppError("Invalid OTP", 400));
        }
        const user = await this._userModel.findOne({
            filter: { email }
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        const userUpdated = await this._userModel.update({ email }, { confirmed: true });

        await deleteKey({
            key: otpKey(email, emailEnum.confirmedEmail)
        });

        res.status(200).json({
            message: "Email confirmed successfully",
            data: userUpdated
        });
    }
    signin = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const user = await this._userModel.findOne({ filter: { email } });

        if (!user) {
            return next(new AppError("Invalid email or password", 400));
        }

        if (!Compare({ plan_text: password, cipher_text: user.password })) {
            return next(new AppError("Invalid email or password", 400));
        }

        const access_token = generateToken({ payload: { id: user._id }, secretKey: ACCESS_SECRET_KEY });

        return res.status(200).json({
            message: "User signed in successfully",
            data: { access_token, user }
        });

    }

    signinWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        const { idToken } = req.body;
        const client = new OAuth2Client();
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new AppError("Invalid Google token", 401);
            }
            const { name, email, email_verified, picture } = payload;
            let user = await this._userModel.findOne({ filter: { email } });
            if (!user) {
                user = await this._userModel.create({
                    email,
                    username: name,
                    confirmed: email_verified,
                    pictures: picture ? [picture] : undefined,
                    provider: providerEnum.google,
                });
            }
            if (user.provider === providerEnum.system) {
                throw new AppError("Please login with email and password", 400);
            }
            const access_token = generateToken({
                payload: { id: user._id },
                secretKey: ACCESS_SECRET_KEY,
            });
            return res.status(200).json({
                message: "User signed in with Google successfully",
                data: { access_token, user },
            });
        } catch (error) {
            next(error);
        }
    };

    // forget password
    forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body

        const user = await this._userModel.findOne({ filter: { email } });

        if (!user) {
            return next(new AppError("User not found", 404));
        }
        const otp = await sendOtp()
        await sendEmail({
            to: email,
            subject: "Reset password OTP",
            html: templateEmail(otp)
        })
        await setValue({ key: otpKey(email, emailEnum.forgetPassword), value: Hash({ plan_text: `${otp}` }), ttl: 60 * 5 })
        res.status(200).json({
            message: "OTP sent to email successfully"
        })
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { newPassword, email, otp } = req.body
        const otpValue = await getValue({
            key: otpKey(email, emailEnum.forgetPassword)
        });
        if (!otpValue) {
            return next(new AppError("OTP expired", 400));
        }
        if (!Compare({ plan_text: otp, cipher_text: otpValue })) {
            return next(new AppError("Invalid OTP", 400));
        }
        const user = await this._userModel.findOne({
            filter: { email }
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        const hashedPassword = Hash({ plan_text: newPassword });
        await this._userModel.update({ email }, { password: hashedPassword });
        await deleteKey({
            key: otpKey(email, emailEnum.forgetPassword)
        });
        res.status(200).json({
            message: "Password reset successfully"
        });
    }
    //  update password 

    updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        const { oldPassword, newPassword } = req.body;
        // console.log("oldPassword:", oldPassword);
        // console.log("hashed in DB:", req.user!.password);
        if (!Compare({ plan_text: oldPassword, cipher_text: req.user!.password })) {
            return next(new AppError("Invalid old password", 400));
        }

        const hashedPassword = Hash({ plan_text: newPassword });
        req.user!.password = hashedPassword;
        await req.user!.save();
        res.status(200).json({
            message: "Password updated successfully"
        });
    }
    // logout 

    logOut = async (req: Request, res: Response, next: NextFunction) => {
        // to log out the user we can just delete the token from the client side, but if we want to invalidate the token we can use redis to store the invalid tokens and check them in the authentication middleware, so that we can prevent the user from using the invalid token to access the protected routes.
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await setValue({ key: token, value: "invalid", ttl: 60 * 60 }) // we can set the ttl to the remaining time of the token, so that we can automatically delete the invalid token from redis after it expires.
        }
        res.status(200).json({
            message: "User logged out successfully"
        });

    }


}

export default new UserService();