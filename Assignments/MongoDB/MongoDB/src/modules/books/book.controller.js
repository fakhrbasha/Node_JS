import { Router } from "express";
import * as PS from './book.service.js'
const bookRouter = Router()

// userRouter.get('/', PS.getUsers)
// userRouter.post('/', PS.createUser)
// userRouter.patch('/:id', PS.updateUser)
// userRouter.delete('/:id', PS.DeleteUser)

// bookRouter.post('/', PS.createBook)
bookRouter.post('/', PS.createBooksCollection)
bookRouter.post('/index', PS.createBooksTitleIndex)

export default bookRouter