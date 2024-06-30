import db from "../lib/db"

export const follow = async (followingId: string, userId: string) => {
    if (followingId === userId) {
        throw new Error("You can't follow yourself");
    }

    const followingUser = await db.user.findUnique({
        where: {
            id: followingId
        }
    })
    if (!followingUser) {
        throw new Error("User not found");
    }

    const followerUser = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!followerUser) {
        throw Error("User not found");
    }

    const existingFollow = await db.userFollowing.findFirst({
        where: {
            followerId: userId,
            followingId: followingId
        }
    });

    console.log("existing follow", existingFollow);


    if (existingFollow) {
        await db.userFollowing.delete({
            where: {
                id: existingFollow.id
            }
        });

        return { message: "Unfollow successful" };
    }
    
    await db.userFollowing.create({
        data: {
            followerId: userId,
            followingId: followingId,
            isFollow: true
        }
    });

    return { message: "Follow successful" };

}