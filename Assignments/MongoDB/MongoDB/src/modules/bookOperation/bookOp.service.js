import { db } from "../../DB/connectionDB.js";

const booksCollection = () => db.collection("books");

const errorResponse = (res, error, message = "Operation failed") => {
    return res.status(400).json({
        message,
        error: error.message,
    });
};

/* ================== Create ================== */
export const createBook = async (req, res, next) => {
    try {
        const result = await booksCollection().insertOne(req.body);

        return res.status(201).json({
            message: "Book inserted successfully",
            book: result,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to insert book");
    }
};

export const multipleBook = async (req, res) => {
    try {
        const result = await booksCollection().insertMany(req.body);

        return res.status(201).json({
            message: "Books inserted successfully",
            books: result,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to insert books");
    }
};

/* ================== Update ================== */
export const updateBook = async (req, res, next) => {
    try {
        const result = await booksCollection().updateOne(
            { title: req.params.title },
            { $set: { year: req.body.year } }
        );

        return res.status(200).json({
            message: "Book updated successfully",
            result,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to update book");
    }
};

/* ================== Find ================== */
export const findBookWithTitle = async (req, res, next) => {
    try {
        const book = await booksCollection().findOne({
            title: req.query.title,
        });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({
            message: "Book found successfully",
            book,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to find book");
    }
};

export const findBookByYearFromTo = async (req, res, next) => {
    try {
        const from = Number(req.query.from);
        const to = Number(req.query.to);

        const books = await booksCollection().find({
            year: { $gte: from, $lte: to },
        }).toArray();

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to find books");
    }
};

export const findBookByGenre = async (req, res, next) => {
    try {
        const genre = req.query.genre;

        const books = await booksCollection().find({
            genres: { $elemMatch: { $eq: genre } },
        }).toArray();

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to find books");
    }
};

export const findBooksByLimit = async (req, res, next) => {
    try {
        const books = await booksCollection().find({}).sort({ year: -1 }).skip(2).limit(3).toArray();

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");
    }
};

export const findBookWithType = async (req, res, next) => {
    try {
        const books = await booksCollection().find({
            year: { $type: "int" },
        }).toArray();

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");
    }
};

export const findBookExclude = async (req, res, next) => {
    try {
        const books = await booksCollection().find({
            genres: { $nin: ["Horror", "Science Fiction"] },
        }).toArray();

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");
    }
};

/* ================== Del ================== */

export const DeleteBooksBefore = async (req, res, next) => {
    try {
        const year = Number(req.query.year);
        const books = await booksCollection().deleteMany({
            year: { $lt: year }
        })
        return res.status(200).json({
            message: "Books deleted successfully",
            deletedCount: books.deletedCount,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");

    }
}
export const aggregateOneMatch = async (req, res, next) => {
    try {
        const books = await booksCollection().aggregate([
            {
                $match: {
                    year: { $gt: 2000 }
                }
            }, {
                $sort: {
                    year: -1
                }
            }
        ]).toArray()

        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");
    }
}
export const aggregateTwoProject = async (req, res, next) => {
    try {
        const books = await booksCollection().aggregate([
            {
                $match: {
                    year: { $gt: 2000 }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1
                }
            }
        ]).toArray()
        return res.status(200).json({
            message: "Books found successfully",
            count: books.length,
            books,
        });
    } catch (error) {
        return errorResponse(res, error, "Failed to retrieve books");
    }
}

export const aggregateThreeBrokeArr = async (req, res, next) => {

    try {
        const books = await booksCollection().aggregate([
            {
                $unwind: "$genres"
            }
        ]).toArray()

        return res.status(200).json({ message: "break an array of genres into separate documents successfully", count: books.length, books })
    } catch (error) {
        return errorResponse(res, error, "Failed to separate genres");

    }
}



export const aggregateJoinBooksWithLogs = async (req, res) => {
    try {
        const result = await db.collection("logs").aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book_details',
                },
            },
            { $unwind: '$book_details' },
            {
                $project: {
                    _id: 0,
                    action: 1,
                    book_details: {
                        title: '$book_details.title',
                        author: '$book_details.author',
                        year: '$book_details.year',
                    },
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "Books joined with logs successfully",
            result
        });
    } catch (error) {
        return res.status(400).json({
            message: "Aggregation failed",
            error: error.message,
        });
    }
};
