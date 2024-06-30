import { PrismaClient, User } from "@prisma/client"
import * as UserService from "../services/userService"
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary"
import db from "../lib/db"
import path from "path"
import { loginSchema, registerSchema } from "../utils/authValidation"
import { v4 as uuidv4 } from "uuid"

export const register = async (body: User) => {
    
    const { error, value } = registerSchema.validate(body)
    const existEmail = await db.user.count({
        where: { email: body.email }
    })
    if(existEmail > 0){
        throw new Error("Email already register")
    }

    
    const hashPassword = await bcrypt.hash(value.password, 10)

    const id = uuidv4()
    const usernameUUIDpart = id.substring(0, 8).replace(/-/g, '')
    const uconvert = `user_${usernameUUIDpart}_${body.fullname?.replace(/\s/g, '_')}`

    const user = await db.user.create({
        data: {
            username: uconvert,
            fullname: body.fullname,
            email: body.email,
            password: hashPassword,
            profile_picture: "",
            bio: "",
            created_at: new Date(),
        }
    })
    console.log(user, "User created successfully")
    return user

}

export const login = async (body: User): Promise<{ token: string }> => {
    const { error, value } = loginSchema.validate(body)
    const existEmail = await db.user.findFirst({
        where: {
            email: value.email,
        }
    })
    if (error) throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);

    if (!existEmail) {
        throw new Error("Email does not registed")
    }

    const matchPassword = await bcrypt.compare(value.password, existEmail.password!)
    if (!matchPassword) {
        throw new Error("Password does not match")
    }

    const User = {
        id: existEmail.id,
        password: existEmail.password,
        username: existEmail.username,
        fullname: existEmail.fullname,
        profilePicture: existEmail.profile_picture,
        bio: existEmail.bio,
    }

    const token = jwt.sign(existEmail, process.env.SECRET_KEY!, {
        expiresIn: "1d"
    })

    return { token }
}