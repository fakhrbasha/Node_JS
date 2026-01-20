
import { Router } from "express";
import { getUsers, addUser, updateUser, getUserById, getUserByEmail } from "./user.service.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get("/by-email", getUserByEmail);
userRouter.get('/:id', getUserById)

userRouter.post('/signup', addUser)
userRouter.put('/update/:id', updateUser)


export default userRouter