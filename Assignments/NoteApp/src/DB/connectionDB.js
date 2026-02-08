import mongoose from "mongoose"

const checkConnectionDb = async () => {
    await mongoose.connect("mongodb://localhost:27017/noteApp", { serverSelectionTimeoutMS: 5000 }).then(() => {
        console.log("connected to DB")
    }).catch((err) => {
        console.log("error connecting to DB", err)
    })
}

export default checkConnectionDb;