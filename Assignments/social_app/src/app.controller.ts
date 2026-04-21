import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { PORT } from "./config/config.service";
import { AppError, globalErrorHandler } from "./common/utils/global-error-handling";
import authRouter from "./modules/auth/user.controller";
import { checkConnection } from "./DB/connectionDB";
import redisService from "./common/services/redis.service";


const app: express.Application = express();

const port: number = Number(PORT); // because process.env.PORT is a string, we need to convert it to a number


//

const bootstrap = () => {

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: "Too many requests, please try again later.",
        handler: (req: Request, res: Response, next: NextFunction) => {
            // res.status(429).json({ message: "Too many requests, please try again later." });
            throw new AppError("Too many requests, please try again later.", 429) // we can use the AppError class to throw an error with a custom message and status code, so that we can use it in the global error handler to set the status code of the response and send the custom message in the response body.
        }
        , legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })

    app.use(express.json());
    checkConnection()
    redisService.connect()
    app.use(cors(), helmet(), limiter)

    app.use("/auth", authRouter)

    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ message: "Welcome to the Social App API!" })
    })

    // invalid url handler

    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        // res.status(404).json({ message: `Invalid URL ${req.originalUrl} with method ${req.method} not found`, status: 404 })
        // throw new Error(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, { cause: 404 }) // we can use the cause property of the Error object to pass the status code to the global error handler, so that we can use it to set the status code of the response in the global error handler.
        throw new AppError(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, 404)
    })


    // global error handler

    app.use(globalErrorHandler)

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })

}

export default bootstrap;