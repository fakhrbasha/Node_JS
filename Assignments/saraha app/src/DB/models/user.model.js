import mongoose from "mongoose";
import { RoleEnum, GenderEnum, ProviderEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true

    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // lowercase: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider == ProviderEnum.system ? true : false
        },
        minLength: 6,
        trim: true

    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.male
    },
    phone: {
        type: String,
        required: function () {
            return this.provider == ProviderEnum.system ? true : false
        }
    },
    profilePicture: String,
    confirmed: Boolean,
    provider: {
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
    }
}, {
    timestamps: true,
    strictQuery: true, // when true, Mongoose will only save fields that are defined in the schema. Any fields that are not defined in the schema will be ignored and not saved to the database.
    toJSON: { virtuals: true },
})


// make key virtual to get full name of user and split it to first name and last name when set it

userSchema.virtual('userName')
    .get(function () {
        return this.firstName + " " + this.lastName
    }).set(function (value) {
        const [firstName, lastName] = value.split(" ")
        this.set({ firstName, lastName })
    })


const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;