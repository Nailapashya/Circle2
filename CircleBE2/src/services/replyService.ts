import db from "../lib/db";
import cloudinary from "../lib/cloudinary";
import * as fs from "fs";
import { replySchema, threadSchema } from "../utils/threadValidation";
import { Reply } from "@prisma/client"

export const addReply = async (threadId: string, body: Reply, userId: string, files?: { [fieldname: string]: Express.Multer.File[] | null }) => {
    try {
        const { value, error } = replySchema.validate(body);

        if (error) {
            console.error('Validation Error:', error);
            throw new Error(`Validation error: ${error.details[0].message}`);
        }

        const userSelected = await db.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!userSelected) {
            throw new Error("User not found");
        }

        const threadSelected = await db.thread.findUnique({
            where: {
                id: threadId
            }
        });

        if (!threadSelected) {
            throw new Error("Thread not found");
        }

        let imagesReply: any[] = [];
        if (files && files.images) {
            const uploadPromises = files.images.map(async (img) => {
                const uploadResult = await cloudinary.uploader.upload(img.path, {
                    folder: "Circle53"
                });

                fs.unlinkSync(img.path);

                return {
                    url: uploadResult.secure_url
                };
            });

            imagesReply = await Promise.all(uploadPromises);
            console.log('Images uploaded:', imagesReply);

       

        } 
        const newReply = await db.reply.create({
            data: {
                content: body.content,
                image: imagesReply[0] ? imagesReply[0].url : null, 
                User: {
                    connect: { id: userId }
                },
                Thread: {
                    connect: { id: threadId }
                }
            }
        });
        console.log('New reply created:', newReply);

        return newReply;
    } catch (error) {
        console.error('Error in addReply:', error);
        throw error;
    }
};


export const updateReply = async (id: string, userId: string, body: Reply) => {
    const { error } = threadSchema.validate(body)
    const userSelected = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!userSelected) {
        throw new Error("User not found");
    }

    const replySelected = await db.reply.findUnique({
        where: {
            id: id
        }
    })
    if (!replySelected) {
        throw new Error("Reply not found")
    }

    return db.reply.update({
        where: { id },
        data: {
            ...body
        }
    })
}

export const deleteReply = async (id: string) => {
    return await db.reply.delete({
        where: { id }
    })
}