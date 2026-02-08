import { Router } from "express";
import * as NS from './note.service.js'
import { auth } from "../../middleware/auth.middleware.js";
const noteRouter = Router()

noteRouter.post('/', auth, NS.createNote)
noteRouter.patch('/all', auth, NS.updateAllNotes)
noteRouter.get('/pagination-sort', auth, NS.retrieveNotesPagination)
noteRouter.get('/note-by-content', auth, NS.NoteByContent)
noteRouter.get('/note-with-user', auth, NS.noteWithUser)
noteRouter.get('/aggregate-note', auth, NS.aggregateNote)
noteRouter.delete('/delete-all', auth, NS.deleteAllNotes)
noteRouter.put('/replace/:id', auth, NS.replaceNote)
noteRouter.get('/:id', auth, NS.getNoteById)
noteRouter.patch('/:id', auth, NS.updateNote)
noteRouter.delete('/:id', auth, NS.deleteNote)



export default noteRouter;
