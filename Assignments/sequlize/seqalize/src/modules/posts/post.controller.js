

import { Router } from "express";
import { addPost, deletePost, getPost, getPostDetails, getPostDetailsWthCommentLen, getPostForUser } from "./post.service.js";

const postRouter = Router()

postRouter.get('/', getPost)
postRouter.post('/', addPost)
postRouter.get('/details', getPostDetails)
postRouter.get('/comment-count', getPostDetailsWthCommentLen)
postRouter.get('/:userId', getPostForUser)
postRouter.delete('/:postId', deletePost)

export default postRouter