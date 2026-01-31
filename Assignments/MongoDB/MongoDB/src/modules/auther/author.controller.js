import { Router } from "express";
import * as PS from "./author.service.js"
const authorRouter = Router()
authorRouter.post("/", PS.createAuthor)


export default authorRouter