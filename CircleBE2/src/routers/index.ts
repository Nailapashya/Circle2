import {Router} from "express"
import authRouter from "../routers/authRouter"
import userRouter from "./userRouter"
import threadRouter from "./threadRouter"
import likeRouter from "./likeRouter"
import followRouter from "./followRouter"
import replyRouter from "./reply.Router"

const router = Router()

router.use(authRouter)
router.use("/user",userRouter)
router.use("/thread",threadRouter)
router.use("/like", likeRouter)
router.use(followRouter)
router.use(replyRouter)


export default router