import { Request, Response } from "express";
import * as UserService from "../services/userService"

export const findAll = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const page = parseInt(req.params.page) || 1
        console.log("ini body", body)
        const dataUser = await UserService.findAll(body, page)
        return res.status(200).json(dataUser)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { body } = req
        return res.status(200).json(await UserService.createUser(body))
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const dataUser = await UserService.getSingleUser(userId)
        return res.status(200).json(dataUser)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateWithoutImage = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const body = req.body
        const dataUser = await UserService.updateWithoutImage(userId, body)
        return res.status(200).json(dataUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Error saat update without image")
    }
}

export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId    
        const body = req.body
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const data = await UserService.uploadProfileImage(userId, body, files)

        return res.status(200).json(data)

    } catch (error) {
        console.log(error)
        return res.status(500).json("Error saat upload profile image")
    }
} 

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const dataUser = await UserService.deleteUser(userId)
        return res.status(200).json(dataUser)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const findSuggestedUser = async (req: Request, res: Response) => {
    try {
        const sessionId = res.locals.userId;
        const limit = req.query.limit || 3

        const data = await UserService.findSuggestedUser(+limit, sessionId);
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const findByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name
        const dataUser = await UserService.findByName(name)

        return res.status(200).json(dataUser)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const findById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const dataUser = await UserService.findById(userId)
        return res.status(200).json(dataUser)

    } catch (error) {
        console.log(error)
        throw error
    }
}