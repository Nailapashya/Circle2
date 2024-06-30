import { Thread } from "@prisma/client";
import db from "../lib/db";
import { threadSchema } from "../utils/threadValidation";
import cloudinary from "../config";
import * as fs from "fs";
import redisClient, { DEFAULT_EXPIRATION } from "../cache/redis"

let isRedisConnected = false
const redisConnectedDone = async () => {
    if (!isRedisConnected) {
        try {
            await redisClient.connect()
            isRedisConnected = true
        } catch (error) {
            console.log("Error connecting to redis", error);

        }
    }
}

export const findAllRedis = async (page: number) => {
    await redisConnectedDone();
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const cacheKey = `threads_page_${page}`;
    if (!cacheKey) {
        throw new Error("KEY not found");
    }

    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
        const threads = JSON.parse(cacheData);

        const findthreads = await db.thread.findMany({
            skip,
            take: pageSize,
            include: {
                user: true,
                Like: true,
                replies: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const totalThread = await db.thread.count();
        const totalPages = Math.ceil(totalThread / pageSize);

        if (
            threads.data.length === findthreads.length 
        ) {
            return threads
        } else {
            await redisClient.del(cacheKey)
        }
    }

    const threads1 = await db.thread.findMany({
        skip,
        take: pageSize,
        include: {
            user: true,
            Like: true,
            replies: true
        },
        orderBy: {
            created_at: 'desc'
        }
    })

    const totalThread = await db.thread.count()
    const totalPages = Math.ceil(totalThread / pageSize)
    if (page > totalPages) {
        throw new Error ("Page not found")
    }

        const threads2 = {
            data: threads1,
            pagination: {
                totalThread,
                totalPages,
                currentPage: page,
                pageSize
            }
        }
    
        redisClient.setEx(
            cacheKey,
            DEFAULT_EXPIRATION,
            JSON.stringify({
                message: "Find All Cache Thread Success",
                data: threads2.data,
                pagination: threads2.pagination
            }))
};


export const findAll = async (): Promise<Thread[]> => {
    return db.thread.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                }
            },
            images: true,
        }
    })
}

export const addThread = async (body: Thread, userId: string, files?: { [fieldname: string]: Express.Multer.File[] }): Promise<Thread | null> => {
    const { value, error } = threadSchema.validate(body);
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }

    let thread: Thread;
    try {
        thread = await db.thread.create({
            data: {
                content: value.content,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                isLiked: value.isLiked || false,
            }
        });


        let imagesData = []
        if (files && files.images) {
            const uploadPromises = files.images.map(async (img) => {
                const uploadResult = await cloudinary.uploader.upload(img.path, {
                    folder: "Circle53",
                })

                fs.unlinkSync(img.path);

                return {
                    url: uploadResult.secure_url,
                    thread_id: thread.id,
                };
            });



            imagesData = await Promise.all(uploadPromises);
            console.log(imagesData);

            await db.threadImage.createMany({
                data: imagesData,
            });
        }

        const threadWithImages = await db.thread.findUnique({
            where: {
                id: thread.id,
            },
            include: {
                images: true,
            }
        })

        if (!threadWithImages) {
            throw new Error("Thread not found after creation")
        }

        return threadWithImages;
    } catch (error) {
        console.error("Error saat menambahkan thread:", error);
        throw error;
    }
};

export const findById = async (threadId: string) => {
    const thread = await db.thread.findUnique({
        where: { id: threadId },
        select: {
            id: true,
            content: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    fullname: true
                }
            },
            images: true,
        }
    });

    return thread
}


export const updateThread = async (threadId: string, body: string) => {
    return db.thread.update({
        where: { id: threadId },
        data: {
            content: body,
        },
        include: {
            images: true
        }
    });
};

export const deleteThread = async (threadId: string) => {
    return db.thread.delete({
        where: { id: threadId },
    })
}
