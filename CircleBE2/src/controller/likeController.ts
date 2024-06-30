import { Request, Response } from "express";
import * as LikeService from "../services/likeService";

export const like = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const userId = res.locals.userId;
        
        const dataLike = await LikeService.like(threadId, userId);
        console.log(dataLike);
        
        return res.status(200).json(dataLike);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while liking the thread" });
    }
};
