const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
  Post_likes,
  Comment,
  Filter,
} = require("../../models");
import { Op, Sequelize } from "sequelize";
const { randTextRange } = require("@ngneat/falso");
const { postImgs } = require("./s3FileIds");

interface UserObject {
  id: number;
}

function randomDateLast30Days() {
  let daysAgo = Math.floor(Math.random() * 30) + 1; // 1 to 30
  let date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function seedUser(userId: number, iterations: number): Promise<void> {
  try {
    for (let i = 0; i < iterations; i++) {
      // Get a random user
      const randomUser = await User.findOne({
        where: {
          id: {
            [Op.ne]: userId,
            [Op.notIn]: [
              Sequelize.literal(
                `(SELECT followingUserId FROM Followers WHERE followerUserId = ${userId})`
              ),
            ],
          },
        },
        order: Sequelize.literal("rand()"),
        limit: 1,
      });

      if (!randomUser) {
        throw new Error("No other users found");
      }

      // Create a new follower relationship
      const follow = await Follower.create({
        followerUserId: userId,
        followingUserId: randomUser?.id,
        createdAt: new Date(),
      });

      console.log(`User ${userId} is now following user ${randomUser?.id}`);
    }

    for (let i = 0; i < 3; i++) {
      // create a new post

      const createdAt = randomDateLast30Days();

      const post = await Post.create({
        userId: userId,
        caption: randTextRange({ min: 10, max: 100 }),
        createdAt, // random date between 1 and 30 days ago,
      });

      await Post_media.create({
        postId: post.id,
        mediaFileId: postImgs[Math.floor(Math.random() * postImgs.length)],
        filterId: null,
        position: 1,
        createdAt,
      });

      for (let i = 0; i < 8; i++) {
        const createdByUserId = Math.floor(Math.random() * 100) + 1;

        await Comment.create({
          createdByUserId: createdByUserId,
          postId: post.id,
          comment: randTextRange({ min: 10, max: 100 }),
          commentRepliedToId: null,
        });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unexpected error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
}

export default seedUser;
