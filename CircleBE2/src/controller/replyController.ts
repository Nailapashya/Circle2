import * as replyService from "../services/replyService"
import { Request, Response } from "express"

export const addReply = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const body = req.body;
        const userId = res.locals.userId;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] | null }; 

        console.log('Request data:', { threadId, body, userId, files });

        const dataReply = await replyService.addReply(threadId, body, userId, files);

        return res.status(200).json(dataReply);
    } catch (error) {
        console.error('Controller error:', error);
        return res.status(500).json({ error: "Terjadi error saat addReply" });
    }
};


export const updateReply = async(req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const body = req.body;
        const userId = res.locals.userId
        return res.status(200).json(await replyService.updateReply(id, userId, body));

    }catch (error) {
        console.log(error);
        
        return res.status(500).json({error: "Terjadi error saat update Reply"})
    }
}

export const deleteReply = async(req: Request, res: Response) => {
    try{
        const id = req.params.id;
        return res.status(200).json(await replyService.deleteReply(id));

    } catch(error) {
        return res.status(500).json({error: "Terjadi error saat update Reply"})
    }
}