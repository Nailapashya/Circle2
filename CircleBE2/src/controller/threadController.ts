import { Request, Response } from "express";
import * as ThreadService from "../services/threadService"
import { Thread } from "@prisma/client";

export const findAllRedis = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.params.page)
        const dataThread = await ThreadService.findAllRedis(page)
        return res.status(200).json(dataThread)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
export const findAll = async (req: Request, res: Response) => {
    try {
        const dataThread = await ThreadService.findAll()
        return res.status(200).json(dataThread)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

export const addThread = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        console.log("userId: ", userId)
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        console.log(files);
        const dataThread = await ThreadService.addThread(req.body as Thread, userId, files)

        res.status(200).json(dataThread)
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json(error.message)
    }
}

export const findById = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId
        const dataThread = await ThreadService.findById(threadId)
        return res.status(200).json(dataThread)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const updateThread = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const body = req.body.content;

        const dataThread = await ThreadService.updateThread(threadId, body);

        return res.status(200).json(dataThread);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export const deleteThread = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId
        const dataThread = await ThreadService.deleteThread(threadId)

        return res.status(200).json(dataThread)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}