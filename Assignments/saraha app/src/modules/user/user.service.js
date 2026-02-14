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

export const signUp = async (req, res, next) => {
    const { userName, email, password, age, gender, phone } = req.body

    if (await db_service.findOne({ model: userModel, filter: { email } })) {
        return res.status(409).json({ message: "email already exist" })
    }
    const otp = generateOTP()
    const user = await db_service.create({ model: userModel, data: { userName, email, password: hashSync(password, 12), age, gender, phone: encrypt(phone) } })
    await sendOTP(email, otp)
    // return res.status(201).json({ message: "user created successfully", user })
    successResponse({ res, status: 201, message: "user created successfully", data: user })
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

export const getProfile = async (req, res, next) => {
    successResponse({ res, message: "user profile retrieved successfully", data: req.user })

}