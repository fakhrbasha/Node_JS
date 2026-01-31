import { Router } from "express"
import * as PS from "./log.service.js"

const logsRouter = Router()

logsRouter.post('/capped', PS.createCappedLogsCollection)

export default logsRouter