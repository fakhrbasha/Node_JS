import { db } from "../../DB/connectionDB.js"


export const createCappedLogsCollection = async (req, res, next) => {
    try {
        const capped = await db.createCollection("logs", {
            capped: true,
            size: 1024 * 1024
        })
        return res.status(201).json({
            message: "Capped logs collection created successfully (1MB)"
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to create capped collection",
            error: error.message,
        });
    }
}


