import  bcrypt  from 'bcrypt';
import db from "../lib/db";
import { User } from "@prisma/client"
import { update } from "../utils/authValidation"
import cloudinary from '../config';
import path from 'path';
import fs from "fs";
import { v4 as uuidv4 } from "uuid"


export const findAll = async (body: User, page: number) => {
    const pageSize = 10
    const skip = (page - 1) * pageSize
    const users = await db.user.findMany({
        skip,
        take: pageSize
    })
    const totalUsers = await db.user.count()
    const totalPages = Math.ceil(totalUsers / pageSize)
    if (page > totalPages) {
        throw new Error("page not found")
    }

    const userss = {
        users,
        pagination: {
            totalUsers,
            totalPages,
            currentPage: page,
            pageSize
        }
    }

    return userss
}

export const createUser = async (body: User): Promise<User> => {
    return db.user.create({
        data: body
    })
}

export const getSingleUser = async (id: string): Promise<User | null> => {
    return db.user.findFirst({
        where: { id }
    })
}

export const updateWithoutImage = async (userId: string, body: User) => {
    const { error } = update.validate(body)
    const user = await db.user.findUnique({
        where: { id: userId }
    })

    if (!user) {
        throw new Error("User not found")
    }

    let hashPassword = user.password
    if (body.password !== undefined && body.password !== "") {
        hashPassword = await bcrypt.hash(body.password as string, 10)
    }
    let fullname = user.fullname
    let username = user.username

    const id = uuidv4()
    const usernameUUIDpart = id.substring(0, 8).replace(/-/g, '')
    if (body.fullname !== undefined && body.fullname !== "") {
        fullname = body.fullname
         username = `user_${usernameUUIDpart}_${body.fullname?.replace(/\s/g, '_')}`
    }

    let bio = user.bio
    if (body.bio !== undefined && body.bio !== "") {
        bio = body.bio
    }

    

    return db.user.update({
        where: { id: userId },
        data: {
            fullname: fullname,
            username: username,
            password: hashPassword,
            bio: bio
        }
 
    })
}

export const uploadProfileImage = async (userId: string, body:User, files: { [fieldname: string]: Express.Multer.File[] }) => {
    const oldData =  await db.user.findUnique({
        where: { id: userId },
        select: { profile_picture: true }
    })

   

    const oldUserData = await db.user.findUnique({
        where: { id: userId },
        select: { profile_picture: true }
    })

    if (!files || !files.images || files.images.length === 0) {
        throw new Error("No image provided");
    }

    const imagePath = files.images[0].path;

    const cloudinaryUpload = await cloudinary.uploader.upload(imagePath, {
        folder: "Circle53"
    })

    const profile_pictureURL = cloudinaryUpload.secure_url

    fs.unlinkSync(imagePath)

    const updateUser = await db.user.update({
        where: { id: userId },
        data: {
            profile_picture: profile_pictureURL
        }
    })
    return updateUser
}

export const deleteUser = async (userId: string) => {
    const exisUser = await db.user.delete({
        where: { id: userId }
    })
}

export const findSuggestedUser = async (limit: number, sessionId: string) => {
    const users = await db.user.findMany({
        where: {id : sessionId},
        take: limit,
        skip: Math.floor(Math.random() * 5),
        select: {
            id: true,
            username: true,
            fullname: true,
            profile_picture: true,
            following: true
        }
    })

    return users
}

export const findByName = async (name: string): Promise<User[]> => {
    const user = await db.user.findMany({
        where: {
            fullname: name,
        }
    })
    if (!user) {
        throw new Error("User not found")
    }
    return user
}

export const findById = async (userId: string): Promise<User | null> => {
    const user = await db.user.findUnique({
        where: { id: userId },
    })

    return user
}