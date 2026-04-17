import { UserDocument } from "../DB/models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
            decoded?: ITokenPayload;
        }
    }
}