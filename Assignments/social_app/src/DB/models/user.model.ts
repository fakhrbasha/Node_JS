

import mongoose, { HydratedDocument, Types } from "mongoose";
import { GenderEnum, providerEnum, RoleEnum } from "../../common/enum/user.enum";



export interface IUser {
    _id: Types.ObjectId,
    firstName: string,
    lastName: string,
    username: string, // virtual key
    email: string,
    age: number,
    phone?: string,
    address?: string,
    password: string,
    confirmed?: boolean,
    role?: RoleEnum,
    gender?: GenderEnum,
    provider?: providerEnum,
    pictures?: string[],



    createdAt?: Date,
    updatedAt?: Date
}


const userSchema = new mongoose.Schema<IUser>({
    firstName:
    {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    email: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, required: true, min: 15, max: 60 },
    phone: { type: String, trim: true },
    address: { type: String },
    password: { type: String, required: true, trim: true, min: 6, max: 100 },
    confirmed: { type: Boolean },
    role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    gender: { type: String, enum: GenderEnum, default: GenderEnum.male },

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



userSchema.virtual("username").get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
}).set(function (this: IUser, value: string) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
})

const userModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default userModel;
export type UserDocument = HydratedDocument<IUser>;