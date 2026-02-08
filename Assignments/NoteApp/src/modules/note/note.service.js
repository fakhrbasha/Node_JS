import mongoose, { model } from "mongoose"
import noteModel from "../../DB/models/note.model.js"
import * as db_service from "../../DB/db.service.js"

export const createNote = async (req, res) => {
    try {
        const userId = req.user.userId
        const { title, content } = req.body
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' })
        }
        const newNote = await db_service.create({ model: noteModel, data: { title, content, userId } })
        return res.status(201).json({ message: 'Note created successfully', note: newNote })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateNote = async (req, res) => {

    try {
        const userId = req.user.userId
        const noteId = req.params.id
        const { title, content } = req.body
        // first find the note by id
        const note = await db_service.findOne({ model: noteModel, filter: { _id: noteId } })
        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'you are not the owner' })
        }
        const updatedNote = await db_service.findByIdAndUpdate({ model: noteModel, filter: noteId, update: { title, content }, options: { new: true } })
        return res.status(200).json({ message: 'Note updated successfully', note: updatedNote })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const replaceNote = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const noteId = req.params.id
        const { title, content } = req.body
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' })
        }
        // first find the note by id
        const note = await db_service.findOne({ model: noteModel, filter: { _id: noteId } })
        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'you are not the owner' })
        }
        const updatedNote = await db_service.findByIdAndUpdate({ model: noteModel, filter: noteId, update: { title, content, userId }, options: { new: true, overwrite: true } })
        return res.status(200).json({ message: 'Note replaced successfully', note: updatedNote })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateAllNotes = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { title } = req.body
        if (!title) {
            return res.status(400).json({ message: 'Title is required' })
        }
        const updatedNotes = await db_service.updateMany({ model: noteModel, filter: { userId }, update: { title } })
        if (updatedNotes.matchedCount === 0) {
            return res.status(404).json({ message: 'No notes found for this user' })
        }
        return res.status(200).json({ message: 'All notes updated successfully', updatedNotes })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteNote = async (req, res) => {
    try {
        const userId = req.user.userId
        const noteId = req.params.id
        const note = await db_service.findOne({ model: noteModel, filter: { _id: noteId } })
        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'you are not the owner' })
        }

        const deletedNote = await db_service.deleteOne({ model: noteModel, filter: noteId })
        return res.status(200).json({ message: 'Note deleted successfully', note: deletedNote })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const retrieveNotesPagination = async (req, res) => {
    try {
        const userId = req.user.userId
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 3
        // for pagination we need to skip the previous pages and limit the number of notes returned
        // for ex if in page 1 we return notes from 1 to 10, in page 2 we need to skip the first 10 notes and return the next 10 notes

        // 0 - 1 * 3 = 0
        // 2 - 1 * 3 = 3 skip the first 3 notes and return the next 3 notes
        // 3 - 2 * 3 = 6 skip the first 6 notes and return the next 3 notes etc..
        const skip = (page - 1) * limit

        const notes = await db_service.find({ model: noteModel, filter: { userId }, options: { skip, limit, sort: { createdAt: -1 } } })
        return res.status(200).json({ message: 'Notes retrieved successfully', notes, page, limit })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getNoteById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const noteId = req.params.id;
        const note = await db_service.findOne({ model: noteModel, filter: { _id: noteId } });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not the owner of this note' });
        }
        return res.status(200).json({ message: 'Note retrieved successfully', note });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const NoteByContent = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const content = req.query.content;

        if (!content) {
            return res.status(400).json({ message: 'Content query parameter is required' });
        }

        const note = await db_service.findOne(
            {
                model: noteModel,
                filter: {
                    userId,
                    content: { $regex: content, $options: 'i' } // 'i' = case-insensitive
                }
            });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not the owner' });
        }

        return res.status(200).json({ message: 'Note retrieved successfully', note });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// export const noteWithUser = async (req, res, next) => {
//     try {
//         const userId = req.user.userId;
//         const note = await db_service.find({ model: noteModel, filter: { userId }, options: { populate: { path: 'userId', select: 'email -_id' }, select: 'title userId createdAt' } })
//         if (!note || note.length === 0) {
//             return res.status(404).json({ message: 'Note not found' })
//         }

//         return res.status(200).json({ message: 'Note with user retrieved successfully', note })

//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error', error: error.message })
//     }
// }

export const noteWithUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const notes = await noteModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'

                }
            },
            { $unwind: '$userId' },
            { $project: { title: 1, userId: { email: "$userId.email" }, createdAt: 1 } }
        ])
        return res.status(200).json({ message: 'Notes with user retrieved successfully', notes })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const aggregateNote = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const title = req.query.title
        if (!title) {
            return res.status(400).json({ message: 'Title query parameter is required' });
        }
        const notes = await noteModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), title: { $regex: title, $options: 'i' } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $project: { title: 1, user: { email: "$user.email", name: "$user.name" }, createdAt: 1 } }
        ])
        return res.status(200).json({ message: 'Notes retrieved successfully', notes })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteAllNotes = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await noteModel.deleteMany({ userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No notes found to delete' });
        }
        if (userId !== req.user.userId) {
            return res.status(403).json({ message: 'you are not the owner' })
        }
        return res.status(200).json({
            message: 'All your notes have been successfully deleted',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
