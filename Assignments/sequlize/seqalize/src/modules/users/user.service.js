import userModel from "../../DB/model/user.model.js"


export const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.findAll()
        res.status(200).json({ message: 'done', users })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error })

    }
}

export const addUser = async (req, res, next) => {

    try {
        const addUser = await userModel.create(req.body)
        res.status(201).json({ message: 'user add success', addUser })
    } catch (error) {
        // if (error.name === "SequelizeValidationError") {
        //     const messages = error.errors.map(err => err.message)
        //     return res.status(400).json({ message: messages })
        // }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Email already exists",
            });
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userModel.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        user.set(req.body)
        await user.save({ validate: false }) // to skip validation

        return res.status(200).json({ Message: "user created or updated Successfully", user })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByPk(id, {
            attributes: { exclude: ["role"] }, //  exclude role
        });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        return res.status(200).json({
            message: "User Fetch Successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email query parameter is required",
            });
        }

        const user = await userModel.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "User Not Exist",
            });
        }

        return res.status(200).json({
            message: "User Fetched Successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};
