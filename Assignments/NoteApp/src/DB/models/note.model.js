import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value !== value.toUpperCase();
                },
                message: "Title must not be uppercase",
            },
        },

        content: {
            type: String,
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
    }
);

const noteModel =
    mongoose.models.note || mongoose.model("note", noteSchema);

export default noteModel;
