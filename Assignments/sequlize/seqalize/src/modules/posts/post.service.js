import { fn, Model, Sequelize } from "sequelize"
import { commentModel, postModel, userModel } from "../../DB/model/index.js"


export const getPost = async (req, res, next) => {
    try {
        const posts = await postModel.findAll()
        return res.status(200).json({ Message: "Posts Fetch Successfully", posts })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error })
    }
}
export const getPostForUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const posts = await postModel.findAll({
            where: { userId },
        });

        if (!posts.length) {
            return res.status(404).json({
                message: "No posts found for this user",
            });
        }

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }

}
export const addPost = async (req, res, next) => {
    try {
        const addPost = await postModel.create(req.body)
        return res.status(201).json({ Message: "Create Post Successfully", addPost })
    } catch (error) {
        return res.status(404).json({ Message: "Something Error", error })
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await postModel.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        if (post.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this post",
            });
        }
        await post.destroy();
        return res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const getPostDetails = async (req, res, next) => {
    try {
        const postDetail = await postModel.findAll({
            attributes: ['id', 'title'],

            include: [
                {
                    model: userModel,
                    attributes: ['id', 'Name'],
                },
                {
                    model: commentModel,
                    attributes: ['id', 'content'],
                },
            ],
        });

        return res.status(200).json({
            message: "Post Details Fetch Successfully",
            postDetail,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something Error",
            error: error.message,
        });
    }
};
export const getPostDetailsWthCommentLen = async (req, res, next) => {
    try {
        const postDetail = await postModel.findAll({
            attributes: [
                'id',
                'title',
                [Sequelize.fn('COUNT', Sequelize.col('comments.c_id')), 'CommentCount']
            ],
            include: [
                // {
                //     model: userModel,
                //     attributes: ['id', 'Name'],
                // },
                {
                    model: commentModel,
                    attributes: [],
                },
            ],
            group: ['post.p_id'],
        });

        return res.status(200).json({
            message: "Post Details with comment count Fetch Successfully",
            postDetail,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something Error",
            error: error.message,
        });
    }
};

// /posts/comment-count

