import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true

    },
    age: {
        type: Number,
        min: 18,
        max: 60
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    }

}, {
    timestamps: true,
    strictQuery: true, // when true, Mongoose will only save fields that are defined in the schema. Any fields that are not defined in the schema will be ignored and not saved to the database.
})


const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;