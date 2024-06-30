import * as FollowService from "../services/followService"
import { Request, Response } from "express"

export const follow = async(req:Request, res:Response) => {
    try{
        const followingId = req.params.followingId
        const userId = res.locals.userId

        const dataFollow = await FollowService.follow(followingId, userId)
        console.log(dataFollow);
        return res.status(200).json(dataFollow)    

    } catch(error) {
        console.error(error)
        return res.status(500).json(" Error when follow")
    }
}