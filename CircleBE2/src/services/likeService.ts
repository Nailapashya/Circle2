import db from "../lib/db";

export const like = async (thread_id: string, userId: string) => {
    const userSelected = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!userSelected) {
        throw new Error("User not found");
    }

    const threadSelected = await db.thread.findUnique({
        where: {
            id: thread_id
        },
        include: {
            Like: true
        }
    })
    if (!threadSelected) {
        throw new Error("Thread no found");
    }

    const existingLike = await db.like.findFirst({
        where: {
            thread_id: thread_id,
            user_id: userId
        }
    });

    if (existingLike) {
        await db.like.delete({
            where: {
                id: existingLike.id
            }
        });

        return { message: "Delete like was successful" };
    } else {
        await db.like.create({
            data: {
                thread_id: thread_id,
                user_id: userId
            }
        });

        return { message: "Like was successful" };
    }
};
