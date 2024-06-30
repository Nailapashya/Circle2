import { Router } from "express";
import * as threadController from "../controller/threadController"
import authentication from "../middlewares/authentication";
import upload from "../middlewares/upload";

const threadRouter = Router()

threadRouter.get("/findAllRedis/:page", authentication, threadController.findAllRedis)
threadRouter.get("/findAll", authentication, threadController.findAll)
threadRouter.post("/addThread", authentication, upload.fields([
    { name: "images", maxCount: 4 }
]), threadController.addThread)
threadRouter.get("/findById/:threadId", authentication, threadController.findById)
threadRouter.put("/update/:threadId", authentication, threadController.updateThread)
threadRouter.delete("/delete/:threadId", authentication, threadController.updateThread)

export default threadRouter