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
import fs from "fs"
import { randomUUID } from 'crypto'
import revokeTokenModel from "../../DB/models/revokeToken.model.js"
import { del, get, get_key, increment, Keys, revoke_keys, setValue } from "../../DB/models/redis/redis.service.js"
import cloudinary from "../../utils/cloudinary.js"
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
    // let uploadedImage = null
    try {
        const { userName, email, password, age, gender, phone } = req.body
        const existUser = await db_service.findOne({ model: userModel, filter: { email } })
        if (existUser) {
            throw new Error("email already exist", { cause: 409 })
        }
        // uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "sarahaApp/users",
        // })
        // const { public_id, secure_url } = uploadedImage
        const user = await db_service.create({
            model: userModel,
            data: {
                userName,
                email,
                password: Hash({ plan_text: password, salt_round: SALT_ROUND }),
                age,
                gender,
                phone: phone ? encrypt(phone) : undefined,
                // profilePicture: { public_id, secure_url },
            }
        })
        // delete local file after successful upload
        // fs.unlinkSync(req.file.path)
        successResponse({
            res,
            status: 201,
            message: "user created successfully",
            data: user
        })
    } catch (error) {
        // delete image from cloudinary if uploaded
        // if (uploadedImage?.public_id) {
        //     await cloudinary.uploader.destroy(uploadedImage.public_id)
        // }
        // // delete local file
        // if (req.file?.path && fs.existsSync(req.file.path)) {
        //     fs.unlinkSync(req.file.path)
        // }
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
    const jwtid = randomUUID() // to generate unique id for each token to be able to revoke it by this id   
    const Access_token = generateToken({ payload: { id: user._id }, secretKey: ACCESS_SECRET_KEY, options: { expiresIn: 60 * 5, jwtid } })
    const refresh_token = generateToken({ payload: { id: user._id }, secretKey: REFRESH_SECRET_KEY, options: { expiresIn: "1y", jwtid } })
    successResponse({ res, message: "user signed in successfully", data: { ...user._doc, Access_token, refresh_token } })

}

export const getProfile = async (req, res, next) => {
    // cash profile
    const key = `profile::${req.user._id}`
    const userExist = await get(key)
    if (userExist) {
        return successResponse({ res, message: "user profile retrieved successfully", data: userExist })
    }
    await setValue({ key, value: req.user, ttl: 60 }) // to cache user profile in redis for 60 seconds to reduce the load on database and improve performance because user profile is accessed frequently and it doesn't change frequently so we can cache it in redis and set ttl for it to automatically delete it after 60 seconds and when user try to access his profile again we check if it's in redis if it is we return it from redis if not we get it from database and cache it in redis again

    const visits = await increment(`profile_visits::${req.user._id}`) // to count number of visits for user profile by incrementing the value in redis for each visit and we can use this data to show it to user or for analytics or to detect any attack if we see a sudden increase in number of visits for user profile that means there is an attack and we can take action to prevent it
    successResponse({ res, message: "user profile retrieved successfully", data: req.user, visits })

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
    const revokeToken = await db_service.findOne({ model: revokeTokenModel, filter: { tokenId: decoded.jti } })
    if (revokeToken) {
        throw new Error("token revoked", { cause: 401 })
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
    await del(`profile::${req.user._id}`) // to delete user profile from redis when update it to get updated profile from database when user try to access his profile again because when user update his profile we need to delete the old profile from redis to get updated profile from database when user try to access his profile again and we can set ttl for user profile in redis to automatically delete it after certain time to get updated profile from database when user try to access his profile again because user profile is accessed frequently and it doesn't change frequently so we can cache it in redis and set ttl for it to automatically delete it after certain time and when user try to access his profile again we check if it's in redis if it is we return it from redis if not we get it from database and cache it in redis again
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
export const logout = async (req, res, next) => {

    const { flag } = req.query
    if (flag === "all") {
        req.user.changeCredential = new Date() // to invalidate all tokens issued before this time because when user logout we need to invalidate all tokens issued before logout time to prevent any attack from old tokens and we can do that by adding changeCredential field to user model and when user logout we update this field with current time and when user try to access any protected route we compare the changeCredential time with the iat time in token if changeCredential time is greater than iat time that means token is invalid because it was issued before logout time
        await req.user.save()

        await del(await Keys(get_key({ userId: req.user._id }))) // to delete all revoked tokens for this user from redis because when user logout we need to invalidate all tokens issued before logout time to prevent any attack from old tokens and we can do that by adding changeCredential field to user model and when user logout we update this field with current time and when user try to access any protected route we compare the changeCredential time with the iat time in token if changeCredential time is greater than iat time that means token is invalid because it was issued before logout time so we don't need to keep revoked tokens in database because they will be automatically invalid by changeCredential field and we can delete them from database to save space
        // await db_service.deleteMany({ model: revokeTokenModel, filter: { userId: req.user._id } })
        // to delete all revoked tokens for this user from database because when user logout we need to invalidate all tokens issued before logout time to prevent any attack from old tokens and we can do that by adding changeCredential field to user model and when user logout we update this field with current time and when user try to access any protected route we compare the changeCredential time with the iat time in token if changeCredential time is greater than iat time that means token is invalid because it was issued before logout time so we don't need to keep revoked tokens in database because they will be automatically invalid by changeCredential field and we can delete them from database to save space

    } else {

        // await db_service.create({ model: revokeTokenModel, data: { tokenId: req.decoded.jti, userId: req.user._id, expireAt: new Date(req.decoded.exp) * 1000 } }) // to invalidate current token only by adding it to revokeToken collection and when user try to access any protected route we check if the token is in revokeToken collection if it is that means token is invalid because it was revoked by user and we can set expireAt to the same time of token expire time to automatically delete the revoked token from database after expire time
        await setValue({
            key: revoke_keys({ userid: req.user._id, jti: req.decoded.jti }),
            value: `${req.decoded.jti}`,
            ttl: req.decoded.exp - Math.floor(Date.now() / 1000) // to set ttl for revoked token in redis to automatically delete it after expire time and we can calculate ttl by subtracting current time from token expire time because both times are in seconds since epoch
        })
    }


    successResponse({ res, message: "user logged out successfully" })
}

export const getProfileVisits = async (req, res, next) => {

    const { id } = req.params

    const visits = await get(`profile_visits::${id}`)

    successResponse({
        res,
        message: "profile visits retrieved",
        data: {
            visits: Number(visits) || 0
        }
    })
}


export const uploadImages = async (req, res, next) => {

    let uploadedImages = []

    try {

        const user = await db_service.findOne({
            model: userModel,
            filter: { _id: req.user._id }
        })

        if (!user) {
            throw new Error("user not found", { cause: 404 })
        }
        if (req.files?.profile_picture) {
            const file = req.files.profile_picture[0]
            const uploaded = await cloudinary.uploader.upload(file.path, {
                folder: "sarahaApp/users/profile"
            })
            const newProfile = {
                public_id: uploaded.public_id,
                secure_url: uploaded.secure_url
            }
            uploadedImages.push(uploaded.public_id)

            if (user.profilePicture?.public_id) {
                user.gallery.push(user.profilePicture)
            }

            user.profilePicture = newProfile

            // delete local file
            fs.unlinkSync(file.path)
        }

        // cover photo
        if (req.files?.cover_photos) {

            const existing = user.coverPhotos?.length || 0
            const uploadedCount = req.files.cover_photos.length

            if (existing + uploadedCount !== 2) {
                throw new Error("cover photos must equal 2", { cause: 400 })
            }

            let covers = []

            for (const file of req.files.cover_photos) {

                const uploaded = await cloudinary.uploader.upload(file.path, {
                    folder: "sarahaApp/users/covers"
                })

                covers.push({
                    public_id: uploaded.public_id,
                    secure_url: uploaded.secure_url
                })

                uploadedImages.push(uploaded.public_id)

                fs.unlinkSync(file.path)
            }

            user.coverPhotos = [...(user.coverPhotos || []), ...covers]
        }

        await user.save()

        res.status(200).json({
            message: "images uploaded successfully",
            data: user
        })

    } catch (error) {
        for (const id of uploadedImages) {
            await cloudinary.uploader.destroy(id)
        }

        next(error)
    }
}
export const removeProfileImage = async (req, res, next) => {

    try {

        const user = await db_service.findOne({
            model: userModel,
            filter: { _id: req.user._id }
        })

        if (!user.profilePicture) {
            throw new Error("No profile picture found", { cause: 404 })
        }

        await cloudinary.uploader.destroy(user.profilePicture.public_id)

        const updatedUser = await db_service.findOneAndUpdate({
            model: userModel,
            filter: { _id: req.user._id },
            update: {
                $unset: { profilePicture: 1 }
            },
            options: { new: true }
        })

        res.status(200).json({
            message: "profile image removed",
            data: updatedUser
        })

    } catch (error) {
        next(error)
    }
}