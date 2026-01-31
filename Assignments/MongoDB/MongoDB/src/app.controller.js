
import express from "express"
import { checkConnection } from "./DB/connectionDB.js"
import bookRouter from "./modules/books/book.controller.js"
import authorRouter from "./modules/auther/author.controller.js"
import logsRouter from "./modules/logs/log.controller.js"
import bookOpRouter from "./modules/bookOperation/bookOp.controller.js"
import logsOpRouter from "./modules/logs/logOp.controller.js"
const app = express()

const port = 3000

export const bootstrap = () => {
    app.use(express.json())
    checkConnection()
    app.get('/', (req, res, next) => {
        res.status(200).json({ message: "welcome in my website " })
    })


    app.use('/collection/book', bookRouter)
    app.use('/collection/authors', authorRouter)
    app.use('/collection/logs', logsRouter)
    app.use('/books', bookOpRouter)
    app.use('/logs', logsOpRouter)
    // app.use('/book', booksRouter)


    app.use("{/*demo}", (req, res, next) => {
        return res.status(404).json({ message: `invalid URL ${req.originalUrl}` })
    })
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    })

}

export default bootstrap