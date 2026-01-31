import { ObjectId } from "mongodb"
import userModel from "../../DB/models/booksModel.js"
import { db } from "../../DB/connectionDB.js";


// export const getUsers = async (req, res, next) => {
//     const users = await userModel.find().toArray()

//     return res.status(200).json({ Message: "Success", users })
// }

// export const createUser = async (req, res, next) => {
//     try {
//         const user = await userModel.insertOne(req.body)
//         return res.status(201).json({ Message: "user created Successfully" })
//     } catch (error) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: error.message,
//         });
//     }
// }

// export const updateUser = async (req, res, next) => {
//     try {
//         const user = await userModel.updateOne(
//             { _id: new ObjectId(req.params.id) },
//             { $set: { age: req.body.age } }
//         )

//         return res.status(201).json({ Message: "user updated Successfully" })
//     } catch (error) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: error.message,
//         });
//     }
// }

// export const DeleteUser = async (req, res, next) => {
//     try {
//         const user = await userModel.deleteOne(
//             { _id: new ObjectId(req.params.id) },
//         )

//         return res.status(201).json({ Message: "user deleted Successfully" })
//     } catch (error) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: error.message,
//         });
//     }
// }

export const createBooksCollection = async (req, res) => {
  try {
    const bookStore = await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Books collection created with validation",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createBooksTitleIndex = async (req, res) => {
  try {
    await db.collection("books").createIndex(
      { title: 1 },
      { name: "title_1" }
    );

    return res.status(201).json({
      message: "Index created on books.title successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create index",
      error: error.message,
    });
  }
};


// export const createBook = async (req, res, next) => {
//   try {
//     const book = await bookModel.insertOne(req.body);

//     return res.status(201).json({
//       message: "Book created successfully",
//       book,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };
