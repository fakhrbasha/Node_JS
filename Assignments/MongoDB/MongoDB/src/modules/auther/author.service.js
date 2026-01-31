import authorModel from "../../DB/models/author/authorModel.js"

export const createAuthor = async (req, res, next) => {
    try {
        const author = await authorModel.insertOne(req.body)
        return res.status(201).json({ Message: "Author Created Successfully", author })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}