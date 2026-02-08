import userModel from "../../DB/models/user.model.js"
import * as db_service from "../../DB/db.service.js"
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res, next) => {
    try {
        const { name, email, password, phone, age } = req.body;

        const isEmailExist = await db_service.findOne({
            model: userModel,
            filter: { email },
        });

        if (isEmailExist) {
            return res.status(409).json({ message: "email already exists" });
        }

        // 2. hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 3. encrypt phone
        const encryptedPhone = CryptoJS.AES.encrypt(
            phone,
            process.env.ENCRYPTION_SECRET
        ).toString();

        const user = await db_service.create({
            model: userModel,
            data: {
                name,
                email,
                password: hashedPassword,
                phone: encryptedPhone,
                age,
            },
        });

        return res
            .status(201)
            .json({ message: "user created successfully", user });
    } catch (error) {
        return res.status(500).json({
            message: "error creating user",
            error: error.message,
            stack: error.stack,
        });
    }
};



export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. check user existence
        const user = await db_service.findOne({
            model: userModel,
            filter: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "user not exist" });
        }

        // 2. compare password (hashed)
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password" });
        }

        // 3. generate JWT (expires in 1 hour)
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successfully",
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "error signing in",
            error: error.message,
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { email, password, ...updateData } = req.body;

        if (password) {
            return res.status(400).json({
                message: "Password cannot be updated here",
            });
        }

        if (email) {
            const emailExists = await db_service.findOne({
                model: userModel,
                filter: {
                    email,
                    _id: { $ne: userId },
                },
            });

            if (emailExists) {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }

            updateData.email = email;
        }

        const updatedUser = await db_service.findByIdAndUpdate({
            model: userModel,
            filter: userId,
            update: updateData,
            options: { new: true },
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User updated",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating user",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const deletedUser = await db_service.findByIdAndUpdate({ model: userModel, filter: userId, update: { isDeleted: true }, options: { new: true } })

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message,
        });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await userModel
            .findOne({ _id: userId, isDeleted: { $ne: true } })
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching user data",
            error: error.message,
        });
    }
};
