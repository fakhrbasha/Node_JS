"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const user_repository_1 = __importDefault(require("../../DB/repository/user.repository"));
const encrypt_1 = require("../../common/utils/security/encrypt");
const hash_1 = require("../../common/utils/security/hash");
const mail_1 = require("../../common/utils/mail/mail");
const email_template_1 = require("../../common/utils/mail/email.template");
const redis_service_1 = require("../../common/utils/redis/redis.service");
const user_enum_1 = require("../../common/enum/user.enum");
const config_service_1 = require("../../config/config.service");
const jwt_1 = require("../../common/utils/jwt/jwt");
const google_auth_library_1 = require("google-auth-library");
class UserService {
    _userModel = new user_repository_1.default();
    constructor() { }
    signup = async (req, res, next) => {
        const { username, email, password, confirmPassword, age, gender, address, phone, confirmed = false } = req.body;
        const emailExist = await this._userModel.findOne({ filter: { email } });
        if (emailExist) {
            return next(new global_error_handling_1.AppError("Email already exists", 409));
        }
        const user = await this._userModel.create({
            username,
            email,
            password: (0, hash_1.Hash)({ plan_text: password }),
            age,
            gender,
            address,
            phone: phone ? (0, encrypt_1.encrypt)(phone) : undefined,
            confirmed
        });
        const otp = await (0, mail_1.sendOtp)();
        await (0, mail_1.sendEmail)({
            to: email,
            subject: "Email confirmation",
            html: (0, email_template_1.templateEmail)(otp)
        });
        await (0, redis_service_1.setValue)({ key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.confirmedEmail), value: (0, hash_1.Hash)({ plan_text: `${otp}` }), ttl: 60 * 5 });
        res.status(200).json({
            message: "User signed up successfully", data: user
        });
    };
    confirmEmail = async (req, res, next) => {
        const { email, otp } = req.body;
        const otpValue = await (0, redis_service_1.getValue)({
            key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.confirmedEmail)
        });
        if (!otpValue) {
            return next(new global_error_handling_1.AppError("OTP expired", 400));
        }
        if (!(0, hash_1.Compare)({ plan_text: otp, cipher_text: otpValue })) {
            return next(new global_error_handling_1.AppError("Invalid OTP", 400));
        }
        const user = await this._userModel.findOne({
            filter: { email }
        });
        if (!user) {
            return next(new global_error_handling_1.AppError("User not found", 404));
        }
        const userUpdated = await this._userModel.update({ email }, { confirmed: true });
        await (0, redis_service_1.deleteKey)({
            key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.confirmedEmail)
        });
        res.status(200).json({
            message: "Email confirmed successfully",
            data: userUpdated
        });
    };
    signin = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this._userModel.findOne({ filter: { email } });
        if (!user) {
            return next(new global_error_handling_1.AppError("Invalid email or password", 400));
        }
        if (!(0, hash_1.Compare)({ plan_text: password, cipher_text: user.password })) {
            return next(new global_error_handling_1.AppError("Invalid email or password", 400));
        }
        const access_token = (0, jwt_1.generateToken)({ payload: { id: user._id }, secretKey: config_service_1.ACCESS_SECRET_KEY });
        return res.status(200).json({
            message: "User signed in successfully",
            data: { access_token, user }
        });
    };
    signinWithGoogle = async (req, res, next) => {
        const { idToken } = req.body;
        const client = new google_auth_library_1.OAuth2Client();
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new global_error_handling_1.AppError("Invalid Google token", 401);
            }
            const { name, email, email_verified, picture } = payload;
            let user = await this._userModel.findOne({ filter: { email } });
            if (!user) {
                user = await this._userModel.create({
                    email,
                    username: name,
                    confirmed: email_verified,
                    pictures: picture ? [picture] : undefined,
                    provider: user_enum_1.providerEnum.google,
                });
            }
            if (user.provider === user_enum_1.providerEnum.system) {
                throw new global_error_handling_1.AppError("Please login with email and password", 400);
            }
            const access_token = (0, jwt_1.generateToken)({
                payload: { id: user._id },
                secretKey: config_service_1.ACCESS_SECRET_KEY,
            });
            return res.status(200).json({
                message: "User signed in with Google successfully",
                data: { access_token, user },
            });
        }
        catch (error) {
            next(error);
        }
    };
    forgetPassword = async (req, res, next) => {
        const { email } = req.body;
        const user = await this._userModel.findOne({ filter: { email } });
        if (!user) {
            return next(new global_error_handling_1.AppError("User not found", 404));
        }
        const otp = await (0, mail_1.sendOtp)();
        await (0, mail_1.sendEmail)({
            to: email,
            subject: "Reset password OTP",
            html: (0, email_template_1.templateEmail)(otp)
        });
        await (0, redis_service_1.setValue)({ key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.forgetPassword), value: (0, hash_1.Hash)({ plan_text: `${otp}` }), ttl: 60 * 5 });
        res.status(200).json({
            message: "OTP sent to email successfully"
        });
    };
    resetPassword = async (req, res, next) => {
        const { newPassword, email, otp } = req.body;
        const otpValue = await (0, redis_service_1.getValue)({
            key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.forgetPassword)
        });
        if (!otpValue) {
            return next(new global_error_handling_1.AppError("OTP expired", 400));
        }
        if (!(0, hash_1.Compare)({ plan_text: otp, cipher_text: otpValue })) {
            return next(new global_error_handling_1.AppError("Invalid OTP", 400));
        }
        const user = await this._userModel.findOne({
            filter: { email }
        });
        if (!user) {
            return next(new global_error_handling_1.AppError("User not found", 404));
        }
        const hashedPassword = (0, hash_1.Hash)({ plan_text: newPassword });
        await this._userModel.update({ email }, { password: hashedPassword });
        await (0, redis_service_1.deleteKey)({
            key: (0, redis_service_1.otpKey)(email, user_enum_1.emailEnum.forgetPassword)
        });
        res.status(200).json({
            message: "Password reset successfully"
        });
    };
    updatePassword = async (req, res, next) => {
        const { oldPassword, newPassword } = req.body;
        if (!(0, hash_1.Compare)({ plan_text: oldPassword, cipher_text: req.user.password })) {
            return next(new global_error_handling_1.AppError("Invalid old password", 400));
        }
        const hashedPassword = (0, hash_1.Hash)({ plan_text: newPassword });
        req.user.password = hashedPassword;
        await req.user.save();
        res.status(200).json({
            message: "Password updated successfully"
        });
    };
    logOut = async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await (0, redis_service_1.setValue)({ key: token, value: "invalid", ttl: 60 * 60 });
        }
        res.status(200).json({
            message: "User logged out successfully"
        });
    };
}
exports.default = new UserService();
