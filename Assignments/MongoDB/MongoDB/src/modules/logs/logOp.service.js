import { db } from "../../DB/connectionDB.js";

import { ObjectId } from "mongodb";

export const createLogs = async (req, res, next) => {
    try {
        const { book_id, action } = req.body;
        const log = await db.collection("logs").insertOne({
            book_id: new ObjectId(book_id),
            action: action
        });
        return res.status(201).json({
            message: "Log inserted successfully",
            log
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to insert log",
            error: error.message,
        });
    }
};
