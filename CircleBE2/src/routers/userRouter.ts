import { Router } from "express";
import * as UserController from "../controller/userController"
import authentication from "../middlewares/authentication";
import upload from "../middlewares/upload";

const userRouter = Router()

userRouter.get("/findAll/:page", authentication, UserController.findAll)
userRouter.post("/create", UserController.createUser)
userRouter.get("/getSingle/:id", authentication, UserController.getSingleUser)
userRouter.delete("/delete/:id", authentication, UserController.deleteUser)
userRouter.get("/findSuggested", authentication, UserController.findSuggestedUser)
userRouter.get("/findByName/:name", authentication, UserController.findByName)
userRouter.get("/findById/:id", authentication, UserController.findById)
userRouter.put("/updateWithoutImage/:userId", authentication, UserController.updateWithoutImage)
userRouter.post("/uploadProfilePicture/:userId", authentication, upload.fields([
    { name: "images", maxCount: 1 }
]), UserController.uploadProfileImage)

export default userRouter