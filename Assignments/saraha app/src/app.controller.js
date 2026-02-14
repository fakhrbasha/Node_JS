import express from 'express'
import checkConnectionDb from './DB/connectionDB.js'
import userRouter from './modules/user/user.controller.js'
const app = express()
const port = 3000






const bootstrap = () => {
    app.use(express.json())
    checkConnectionDb()
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