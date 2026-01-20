import { Op, where } from "sequelize"
import commentModel from "../../DB/model/comment.model.js"
import userModel from "../../DB/model/user.model.js"
import postModel from "../../DB/model/post.model.js"


export const getComments = async () => {
    const comments = await commentModel.findAll()

    return res.status(200).json({ message: "comments fetch successfully", comments })
}


export const addComment = async (req, res, next) => {
    // content postId userId
    // const {postId,userId} = req.body
    try {
        const comments = await commentModel.bulkCreate(req.body.Comments)
        return res.status(201).json({ Message: "Comment Created", comments })

    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error })
    }
}

export const updateCommentByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const { userId, content } = req.body
        const comment = await commentModel.findByPk(id)

        if (!comment) {
            return res.status(404).json({ Message: "Comment Not Found" })
        }

        if (userId !== comment.userId) {
            return res.status(401).json({ Message: "You are not authorized to update this comment" })
        }

        const updated = await comment.update({ content })
        return res.status(200).json({ Message: "updated" })

    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error: error.message })

    }
}

export const findOrCreated = async (req, res, next) => {
    try {
        const { id } = req.params
        const { content, userId, postId } = req.body
        const [comment, created] = await commentModel.findOrCreate({
            where: { content, userId, postId },
            defaults: {
                content, userId, postId
            }
        })

        if (!created) {
            return res.status(200).json({ Message: "Comment already Exist", comment })
        }
        return res.status(201).json({
            Message: "Comment created successfully",
            comment,
        })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error: error.message })

    }
    // if false nor created find if true created 
}

export const findAndCount = async (req, res, next) => {
    try {
        const { word } = req.query

        const comments = await commentModel.findAndCountAll({
            where: {
                content: {
                    [Op.like]: `%${word}%`
                }
            }
        })
        if (comments.count === 0) {
            return res.status(404).json({ message: "No Comment Found" })

        }
        return res.status(200).json({ message: "comments fetched successfully", Count: comments.count, Comments: comments.rows })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error: error.message })
    }
}

export const CommentsNewest = async (req, res, next) => {
    try {
        const { postId } = req.params
        const comments = await commentModel.findAll({
            where: { postId }
            ,
            attributes: ['c_id', 'content', 'createdAt']
            , order: [['createdAt', 'DESC']],
            limit: 3
        })

        if (comments.length === 0) {
            return res.status(404).json({ message: "No Comment Found" })
        }
        return res.status(200).json({ message: "Success", comments })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error: error.message })
    }
}

export const commentDetails = async (req, res, next) => {
    try {
        const { id } = req.params

        const details = await commentModel.findByPk(id, {
            attributes: ['c_id', 'content'],
            include: [
                {
                    model: userModel,
                    attributes: ['u_id', 'name', 'email']
                },
                {
                    model: postModel,
                    attributes: ['p_id', 'title', 'content']
                }
            ]
        })

        return res.status(200).json({ message: 'success', details })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error: error.message })

    }
}