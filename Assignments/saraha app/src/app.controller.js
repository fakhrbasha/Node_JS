import express from 'express'
import checkConnectionDb from './DB/connectionDB.js'
import userRouter from './modules/user/user.controller.js'


// import { resolve } from "node:path"
// dotenv.config({ path: resolve("config/.env.development") })
// dotenv.config({path}) this path to make import correct path


const app = express()
import cors from 'cors'
import dotenv from "dotenv";
import { PORT } from '../config/config.service.js'
dotenv.config();

const port = PORT




const bootstrap = () => {
    app.use(cors(), express.json())
    checkConnectionDb()

    app.use("/upload", express.static("upload")) // to make upload folder public to access it from url http://localhost:4000/users/filename
    // http://localhost:4000/upload/users/1772564292968-586802944__2.png


    app.get('/', (req, res) => {
        return res.status(200).json({ message: 'Welcome to Saraha App' })
    })
    app.use('/users', userRouter)

    app.use('{/*demo}', (req, res, next) => {
        // return res.status(404).json({ message: `Url ${req.originalUrl} not found` })
        throw new Error(`Url ${req.originalUrl} not found`, { cause: 404 })
    })


    // global error handler

    app.use((err, req, res, next) => {
        return res.status(err.cause || 500).json({ message: err.message, stack: err.stack })
    })

    app.listen(port, () => console.log(`app listening on port ${port}!`))
}
export default bootstrap;