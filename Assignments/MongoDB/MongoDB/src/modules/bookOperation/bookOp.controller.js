import * as PS from "./bookOp.service.js"
import { Router } from "express"
const bookOpRouter = Router()

bookOpRouter.post('/', PS.createBook)
bookOpRouter.post('/batch', PS.multipleBook)
bookOpRouter.get('/title', PS.findBookWithTitle)
bookOpRouter.get('/year', PS.findBookByYearFromTo)
bookOpRouter.get('/genre', PS.findBookByGenre)
bookOpRouter.get('/skip-limit', PS.findBooksByLimit)
bookOpRouter.get('/year-integer', PS.findBookWithType)
bookOpRouter.get('/exclude-genres', PS.findBookExclude)
bookOpRouter.get('/aggregate1', PS.aggregateOneMatch)
bookOpRouter.get('/aggregate2', PS.aggregateTwoProject)
bookOpRouter.get('/aggregate3', PS.aggregateThreeBrokeArr)
bookOpRouter.get('/aggregate4', PS.aggregateJoinBooksWithLogs)
bookOpRouter.delete('/delete-year', PS.DeleteBooksBefore)

bookOpRouter.patch('/:title', PS.updateBook)


export default bookOpRouter