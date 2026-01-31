import { Router } from "express"
import * as PS from "./logOp.service.js"

const logsOpRouter = Router()

logsOpRouter.post('/', PS.createLogs)

export default logsOpRouter