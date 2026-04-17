import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/global-error-handling";
import { ACCESS_SECRET_KEY, PREFIX } from "../../config/config.service";
import { verifyToken } from "../utils/jwt/jwt";
import userModel from "../../DB/models/user.model";
interface IJwtPayload {
    id: string;
    email?: string;
}
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError("Unauthorized", 401);
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== PREFIX || !token) {
        throw new AppError("invalid token format", 401);
    }
    const decoded = verifyToken({
        token,
        secretKey: ACCESS_SECRET_KEY
    }) as IJwtPayload;
    if (!decoded?.id) {
        throw new AppError("Invalid token", 401);
    }
    const user = await userModel
        .findById(decoded.id)
        .select("+password");

    if (!user) {
        throw new AppError("User not found", 404);
    }
    req.user = user;
    req.decoded = decoded;
    next();
};