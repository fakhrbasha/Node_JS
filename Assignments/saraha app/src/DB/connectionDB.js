import mongoose from "mongoose"
import { DB_URI } from "../../config/config.service.js"

const checkConnectionDb = async () => {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 5000 }).then(() => {
        console.log("connected to DB")
    }).catch((err) => {
        console.log("error connecting to DB", err)
    })
}

export default checkConnectionDb;