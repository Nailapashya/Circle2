import joi from "joi"

export const registerSchema = joi.object({
    fullname: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
    .message('Password must be at least 8 character long and contain at at least one lowercase latter, one uppercase latter, and one number')
})

export const loginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required()
})

export const update = joi.object({
    bio: joi.string().allow(''),
    fullname: joi.string().allow(''),
    password: joi.string().allow('').pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
        .message('Password must be at least 8 character long and contain at at least one lowercase latter, one uppercase latter, and one number')
})