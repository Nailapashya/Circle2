import { Router } from 'express';
import * as replyController from "../controller/replyController"
import authentication from '../middlewares/authentication';
import upload from '../middlewares/upload';


const replyRouter = Router()

replyRouter.post("/addReply/:threadId", authentication, upload.fields([{name: "images" , maxCount:4}]), replyController.addReply)
replyRouter.put("/updateReply/:id", authentication, replyController.updateReply)
replyRouter.delete("/deleteReply/:id", authentication, replyController.deleteReply)

export default replyRouter
