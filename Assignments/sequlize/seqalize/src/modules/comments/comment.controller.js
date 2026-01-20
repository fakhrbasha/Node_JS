import { Router } from "express";
import { addComment, getComments, updateCommentByID, findOrCreated, findAndCount, CommentsNewest, commentDetails } from "./comment.service.js";

const commentRouter = Router()

commentRouter.get('/', getComments)
commentRouter.post('/', addComment)
commentRouter.get('/find-or-create', findOrCreated)
commentRouter.get('/search', findAndCount)
commentRouter.get('/details/:id', commentDetails)
commentRouter.get('/newest/:postId', CommentsNewest)
commentRouter.patch('/:id', updateCommentByID)

export default commentRouter