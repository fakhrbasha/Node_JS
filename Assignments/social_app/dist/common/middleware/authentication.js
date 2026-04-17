"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const global_error_handling_1 = require("../utils/global-error-handling");
const config_service_1 = require("../../config/config.service");
const jwt_1 = require("../utils/jwt/jwt");
const user_model_1 = __importDefault(require("../../DB/models/user.model"));
const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new global_error_handling_1.AppError("Unauthorized", 401);
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== config_service_1.PREFIX || !token) {
        throw new global_error_handling_1.AppError("invalid token format", 401);
    }
    const decoded = (0, jwt_1.verifyToken)({
        token,
        secretKey: config_service_1.ACCESS_SECRET_KEY
    });
    if (!decoded?.id) {
        throw new global_error_handling_1.AppError("Invalid token", 401);
    }
    const user = await user_model_1.default
        .findById(decoded.id)
        .select("+password");
    if (!user) {
        throw new global_error_handling_1.AppError("User not found", 404);
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
exports.authentication = authentication;
