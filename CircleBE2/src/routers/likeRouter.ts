import { Router } from "express"
import * as likeController from "../controller/likeController"
import authentication from "../middlewares/authentication"

const likeRouter = Router()

likeRouter.post("/like/:threadId", authentication, likeController.like)

export default likeRouter