import * as db_service from "../DB/db.service.js";
import userModel from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/jwt.js";

export const authentication = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new Error("token required", { cause: 401 })
    }
    const [prefix, token] = authorization.split(" ") // Bearer token
    if (prefix !== "Bearer" || !token) {
        throw new Error("invalid token format", { cause: 401 })
    }
    const decoded = verifyToken({ token })
    if (!decoded || !decoded.id) {
        throw new Error("invalid token", { cause: 401 })
    }
    // console.log(decoded);
    // req walk in all the middlewares and controllers with the decoded data
    const user = await db_service.findOne({ model: userModel, filter: { _id: decoded.id } })

    if (!user) {
        throw new Error("user not exist", { cause: 409 })
    }
    req.user = user
    next()

}