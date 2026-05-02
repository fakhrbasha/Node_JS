"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_1 = require("../../common/enum/user.enum");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
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
    age: {
        type: Number, required: function () {
            return this.provider == user_enum_1.providerEnum.system ? true : false;
        }, min: 15, max: 60
    },
    phone: { type: String, trim: true },
    address: { type: String },
    password: {
        type: String, required: function () {
            return this.provider == user_enum_1.providerEnum.system ? true : false;
        }, trim: true, min: 6, max: 100
    },
    confirmed: { type: Boolean },
    role: { type: String, enum: user_enum_1.RoleEnum, default: user_enum_1.RoleEnum.user },
    gender: { type: String, enum: user_enum_1.GenderEnum, default: user_enum_1.GenderEnum.male },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
}).set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = userModel;
