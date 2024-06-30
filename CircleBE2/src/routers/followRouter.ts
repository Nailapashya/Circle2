import { Router } from "express"
import * as followController from "../controller/followController"
import authentication from "../middlewares/authentication"

const followRouter = Router()

followRouter.post("/follow/:followingId", authentication, followController.follow)

export default followRouter