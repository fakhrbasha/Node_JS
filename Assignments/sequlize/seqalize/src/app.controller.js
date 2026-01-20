
import express from "express";
const app = express()
const port = 4000
import { checkConnection, SyncConnection } from './DB/connectionDB.js'
import userRouter from "./modules/users/user.controller.js";
import postRouter from "./modules/posts/post.controller.js";
import commentRouter from "./modules/comments/comment.controller.js";
const bootstrap = () => {

    app.use(express.json())
    checkConnection()
    SyncConnection()

    app.get('/', (req, res, next) => {
        res.status(200).json({ message: "welcome in my website " })
    })


    app.use('/users', userRouter)
    app.use('/posts', postRouter)
    app.use('/comments', commentRouter)




    app.use("{/*demo}", (req, res, next) => {
        return res.status(404).json({ message: `invalid URL ${req.originalUrl}` })
    })


    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    })
}
export default bootstrap