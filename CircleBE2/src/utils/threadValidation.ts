import joi from "joi"

export const threadSchema = joi.object({
    content: joi.string().required(),
    image: joi.string().allow(),
})
export const replySchema = joi.object({
    content: joi.string().allow(),
    image: joi.string().allow(),
})


