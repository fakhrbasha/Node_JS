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
import { Compare, Hash } from "../../utils/security/hash.security.js"
import { ACCESS_SECRET_KEY, PREFIX, REFRESH_SECRET_KEY, SALT_ROUND } from "../../../config/config.service.js"
import joi from "joi"
import { signUpSchema } from "./user.validation.js"
import cloudinary from "../../utils/cloudinary.js"
import fs from "fs"
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
// export const signUp = async (req, res, next) => {


//     // console.log(req.file) // to upload single file and in postman send key avatar and select one file
//     // console.log(req.files) // to upload multiple files and in postman send key avatar and select multiple files

//     // let coverPhotos = []
//     // for (const file of req.files.coverPhotos) {
//     //     coverPhotos.push(file.path)
//     // }

//     // array return array 

//     // fields return object contain key is the name of field and value is array of files because we can upload multiple files for each field
//     // console.log(req.files['avatar']) // to access files of avatar field



//     try {
//         const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
//             folder: "sarahaApp/users", // name folder you need to publish photos in it in cloudinary
//             // public_id : "ahmed" // make name const ahmed when upload any photo to override it because cloudinary by default make name of photo is the name of file in local and if you upload another photo with the same name it will add number to it like ahmed(1) but if you make public_id const ahmed it will override the previous photo and make the name of all photos ahmed and you can access to it by this name without need to know the name of file in local or the name that cloudinary give it when upload it
//             // use_filename: true, // to use the name of file in local as name of photo in cloudinary but if you upload another photo with the same name it will add number to it like ahmed(1) because cloudinary by default add number to it when upload photo with the same name but if you make public_id const ahmed it will override the previous photo and make the name of all photos ahmed and you can access to it by this name without need to know the name of file in local or the name that cloudinary give it when upload it
//             // unique_filename: false, // to not add number to it when upload photo with the same name because cloudinary by default add number to it when upload photo with the same name but if you make public_id const ahmed it will override the previous photo and make the name of all photos ahmed and you can access to it by this name without need to know the name of file in local or the name that cloudinary give it when upload it (use same file name)
//             // resource_type : "video" // to upload video because by default cloudinary upload photos only but if you need to upload video you need to set resource_type to video
//         })

//         // public_id 
//         // secure_url

//         console.log(req.file); 
//         // delete photo in cloudinary
//         // await cloudinary.uploader.destroy(public_id) // to delete photo in cloudinary by public_id
//         // delete folder in cloudinary
//         // await cloudinary.api.delete_folder("sarahaApp/users") // to delete folder in cloudinary by name of folder path

//         // delete all folder and photos in it in cloudinary
//         // await cloudinary.api.delete_resources_by_prefix("sarahaApp/users") // to delete all folder and photos in it in cloudinary by name of folder path

//         const { userName, email, password, age, gender, phone } = req.body

//         if (await db_service.findOne({ model: userModel, filter: { email } })) {
//             return res.status(409).json({ message: "email already exist" })
//         }

//         const user = await db_service.create({
//             model: userModel,
//             data: {
//                 userName,
//                 email,
//                 password: Hash({ plan_text: password, salt_round: SALT_ROUND }),
//                 age,
//                 gender,
//                 phone: phone ? encrypt(phone) : undefined,
//                 profilePicture: { public_id, secure_url },
//                 // coverPhotos: coverPhotos.length > 0 ? coverPhotos : undefined
//             }
//         })

//         successResponse({
//             res,
//             status: 201,
//             message: "user created successfully",
//             data: user
//         })

//     } catch (error) {
//         next(error)
//     }
// }

export const signUp = async (req, res, next) => {

    let uploadedImage = null

    try {

        const { userName, email, password, age, gender, phone } = req.body
        const existUser = await db_service.findOne({ model: userModel, filter: { email } })
        if (existUser) {
            throw new Error("email already exist", { cause: 409 })
        }
        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
            folder: "sarahaApp/users",
        })
        const { public_id, secure_url } = uploadedImage
        const user = await db_service.create({
            model: userModel,
            data: {
                userName,
                email,
                password: Hash({ plan_text: password, salt_round: SALT_ROUND }),
                age,
                gender,
                phone: phone ? encrypt(phone) : undefined,
                profilePicture: { public_id, secure_url },
            }
        })

        // delete local file after successful upload
        fs.unlinkSync(req.file.path)

        successResponse({
            res,
            status: 201,
            message: "user created successfully",
            data: user
        })

    } catch (error) {

        // delete image from cloudinary if uploaded
        if (uploadedImage?.public_id) {
            await cloudinary.uploader.destroy(uploadedImage.public_id)
        }

        // delete local file
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }

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
    const Access_token = generateToken({ payload: { id: user._id }, secretKey: ACCESS_SECRET_KEY, options: { expiresIn: 60 * 5 } })
    const refresh_token = generateToken({ payload: { id: user._id }, secretKey: REFRESH_SECRET_KEY, options: { expiresIn: "1y" } })
    successResponse({ res, message: "user signed in successfully", data: { ...user._doc, Access_token, refresh_token } })

}

export const getProfile = async (req, res, next) => {
    successResponse({ res, message: "user profile retrieved successfully", data: req.user })

}

export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new Error("token required", { cause: 401 })
    }
    const [prefix, token] = authorization.split(" ") // Bearer token
    if (prefix !== PREFIX || !token) {
        throw new Error("invalid token format", { cause: 401 })
    }
    const decoded = verifyToken({ token, secretKey: REFRESH_SECRET_KEY })
    if (!decoded || !decoded.id) {
        throw new Error("invalid token", { cause: 401 })
    }

    const user = await db_service.findOne({ model: userModel, filter: { _id: decoded.id } })

    if (!user) {
        throw new Error("user not exist", { cause: 409 })
    }

    // then generate new access token
    const Access_token = generateToken({ payload: { id: user._id }, secretKey: ACCESS_SECRET_KEY, options: { expiresIn: 60 * 5 } })
    successResponse({ res, message: "access token refreshed successfully", data: { Access_token } })
}

export const shareProfile = async (req, res, next) => {

    const { id } = req.params

    const user = await db_service.findById({ model: userModel, id, select: '-password' })
    if (!user) {
        throw new Error("user not exist", { cause: 409 })
    }
    user.phone = decrypt(user.phone)
    successResponse({ res, message: "user profile retrieved successfully", data: user })
}

export const updateProfile = async (req, res, next) => {
    // const { id } = req.user
    let { firstName, lastName, gender, phone } = req.body

    if (phone) {
        phone = encrypt(phone)
    }

    const user = await db_service.findOneAndUpdate({ model: userModel, filter: { _id: req.user._id }, update: { firstName, lastName, gender, phone } })
    if (!user) {
        throw new Error("user not exist", { cause: 409 })
    }
    successResponse({ res, message: "user profile updated successfully", data: user })
}

export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body

    if (!Compare({ plan_text: oldPassword, cipher_text: req.user.password })) {
        throw new Error("invalid current password", { cause: 400 })
    }

    const hash = Hash({ plan_text: newPassword, salt_round: SALT_ROUND })

    req.user.password = hash

    await req.user.save()

    successResponse({ res, message: "user password updated successfully" })
}