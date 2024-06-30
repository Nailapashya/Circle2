import { Request, Response } from "express"
import * as authService from "../services/authService"
import { User } from "@prisma/client"

export const register = async (req: Request, res: Response) => {
    try {
        const { body } = req
        const data = await authService.register(body as User)
        res.status(200).json(data)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({error : error.message})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { body } = req
        const data = await authService.login(body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        throw new Error
    }
}