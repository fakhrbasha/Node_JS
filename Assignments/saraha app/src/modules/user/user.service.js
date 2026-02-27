import e from "express"
import userModel from "../../DB/models/user.model.js"
import { ProviderEnum } from "../../common/enum/user.enum.js"
import * as db_service from "../../DB/db.service.js"
import { successResponse } from "../../utils/response.success.js"
import { decrypt, encrypt } from "../../utils/security/encrypt_security.js"
import { generateToken, verifyToken } from "../../utils/token/jwt.js"
import { hashSync, compareSync } from 'bcrypt'
import { generateOTP } from "../../utils/mail/otp.js"
import { sendOTP } from "../../utils/mail/mail.js"
import { OAuth2Client } from "google-auth-library"
import { Hash } from "../../utils/security/hash.security.js"
import { SALT_ROUND } from "../../../config/config.service.js"
import joi from "joi"
import { signUpSchema } from "./user.validation.js"
// export const signUp = async (req, res, next) => {

//     const signUpSchema = joi.object({
//         userName: joi.string().required(),
//         password: joi.string().required(),
//         email: joi.string().required()
//     }).required()

//     const result = signUpSchema.validate(req.body, { abortEarly: false })

//     if (result.error) {
//         return res.status(400).json({ message: "error", error })
//     }

//     const { userName, email, password, age, gender, phone } = req.body

//     if (await db_service.findOne({ model: userModel, filter: { email } })) {
//         return res.status(409).json({ message: "email already exist" })
//     }
//     // const otp = generateOTP()
//     // console.log(otp);
//     const user = await db_service.create({ model: userModel, data: { userName, email, password: Hash({ plan_text: password, salt_round: SALT_ROUND }), age, gender, phone: encrypt(phone) } })
//     // // + -> to convert string to number because .env return string 
//     // await sendOTP(email, otp)
//     // // return res.status(201).json({ message: "user created successfully", user })
//     successResponse({ res, status: 201, message: "user created successfully", data: user })
// }
export const signUp = async (req, res, next) => {
    console.log(req.file)


    try {

        const { userName, email, password, age, gender, phone } = req.body

        if (await db_service.findOne({ model: userModel, filter: { email } })) {
            return res.status(409).json({ message: "email already exist" })
        }

        const user = await db_service.create({
            model: userModel,
            data: {
                userName,
                email,
                password: Hash({ plan_text: password, salt_round: SALT_ROUND }),
                age,
                gender,
                phone: phone ? encrypt(phone) : undefined
            }
        })

        successResponse({
            res,
            status: 201,
            message: "user created successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }
}
export const signUpWithGmail = async (req, res, next) => {
    const { idToken } = req.body
    // console.log('BODY:', req.body);
    // console.log(idToken)



    const client = new OAuth2Client();
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email, email_verified, picture } = payload

        let user = await db_service.findOne({ model: userModel, filter: { email } })

        if (!user) {
            user = await db_service.create({ model: userModel, data: { userName: name, email, confirmed: email_verified, profilePicture: picture, provider: ProviderEnum.google } })
        }
        if (user.provider == ProviderEnum.system) {
            throw new Error("please logged in System Only", { cause: 400 })
        }
        const token = generateToken({ payload: { id: user._id, email: user.email } })
        successResponse({ res, message: "user signed in successfully", data: { ...user._doc, token } })



        // console.log('PAYLOAD:', payload);

        // return res.json(payload);
    } catch (err) {
        console.error('GOOGLE VERIFY ERROR:', err);
        return res.status(401).json({ message: 'Invalid Google token' });
    }
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const user = await db_service.findOne({ model: userModel, filter: { email, provider: ProviderEnum.system } })
    if (!user) {
        // return res.status(409).json({ message: "user not exist" })
        throw new Error("user not exist", { cause: 409 })
    }
    if (!compareSync(password, user.password)) {
        // return res.status(409).json({ message: "invalid password" })
        throw new Error("invalid password", { cause: 409 })
    }
    const token = generateToken({ payload: { id: user._id } })
    successResponse({ res, message: "user signed in successfully", data: { ...user._doc, token } })

}
export const signInWithEmail = async (req, res, next) => {

    const { id } = req.body

}

export const getProfile = async (req, res, next) => {
    successResponse({ res, message: "user profile retrieved successfully", data: req.user })

}