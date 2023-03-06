import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
import fs from "fs";
import util from "util";
import { Op, Sequelize } from "sequelize";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
  Post_likes,
} = require("../../models");
require("dotenv").config();
const unlinkFile = util.promisify(fs.unlink);

async function createPost(req: any, res: Response, next: NextFunction) {
  try {
    const file = req.file;

    await uploadFile(file);

    const post = await Post.create({
      caption: req.body.caption,
      userId: req.body.userId,
    });

    const image = await Post_media.create({
      postId: post.id,
      mediaFileId: file.filename,
      position: 1,
    });

    await unlinkFile(file.path);

    res.status(201).send({ post, image });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getAllPosts(req: any, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    !id && res.status(400).send("id is required");

    console.log("get all posts ------------------->,", id);

    const posts = await Post.findAll({
      where: { userId: id },
    });

    const postArr = await Promise.all(
      posts.map(async (post: any) => {
        const images = await Post_media.findAll({
          where: { postId: post.id },
        });

        return { post, images };
      })
    );

    const user = await User.findOne({
      where: { id },
      raw: true,
    });

    console.log("--------------------->user", user);

    delete user.password;

    const profilePic = await Profile_picture.findOne({
      where: { userId: id },
    });

    res.status(201).send({
      posts: postArr,
      user: { ...user, avatar: profilePic?.mediaFileId },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getImage(req: any, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;

    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (error) {
    console.log("img err", error);
    res.status(400).send(error);
  }
}

export interface UserRequest extends Request {
  user?: any;
}
async function getFeed(req: UserRequest, res: Response, next: NextFunction) {
  console.log("get feed ------------------->", req?.user);
  try {
    const { id } = req.params;
    const following = await Follower.findAll({
      where: { followerUserId: id },
    });

    const feedArr = await Promise.all(
      following.map(async (user: any) => {
        const posts = await Post.findAll({
          where: { userId: user?.followingUserId },
        });

        console.log(posts, "posts---------------------------------->");

        const postArr = await Promise.all(
          posts.map(async (post: any) => {
            const images = await Post_media.findAll({
              where: { postId: post.id },
            });

            const totalLikes = await Post_likes.findAll({
              where: { postId: post.id },
            });

            const likesPost = await Post_likes.findOne({
              where: { postId: post.id, userId: id },
            });

            const userDetails = await getUserDetails(post?.userId);

            console.log(
              userDetails,
              "userDetails---------------------------------->"
            );

            return {
              post: {
                ...post.dataValues,
                totalLikes: totalLikes.length,
                likes: likesPost ? true : false,
              },
              images,
              user: {
                ...userDetails,
              },
            };
          })
        );

        return postArr;
      })
    )
      .then((array) => {
        return array
          .flat(1)
          .sort((a: any, b: any) => a.post.createdAt - b.post.createdAt);
      })
      .catch((err) => console.log(err));

    res.cookie("name", "express").send({ feed: feedArr }); //Sets name = express

    // res.status(201).send({
    //   feed: feedArr,
    // });
  } catch (error) {
    console.log(error, "-------------------------wakanda forever");
    res.status(400).send(error);
  }
}

async function toggleLike(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId, userId } = req.body;

    const like = await Post_likes.findOne({
      where: { postId, userId },
    });

    let data;

    if (like) {
      data = await unlikePost(postId, userId);
    } else {
      data = await likePost(postId, userId);
    }

    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function likePost(postId: number, userId: number) {
  try {
    // const { postId, userId } = req.body;

    console.log(postId, userId, "like post ------------------------->");
    const like = await Post_likes.create({
      postId,
      userId,
    });

    console.log(like, "like ------------------------->");

    return like;

    // res.status(201).send({ like });
  } catch (error) {
    console.log(error);
    // res;
  }
}

async function unlikePost(postId: number, userId: number) {
  try {
    // const { postId, userId } = req.body;

    const like = await Post_likes.destroy({
      where: { postId, userId },
    });

    return like;

    // res.status(201).send({ like });
  } catch (error) {
    console.log(error);
    // res.status(400).send(error);
  }
}

async function getLikes(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId } = req.params;

    const likes = await Post_likes.findAll({
      where: { postId },
    });

    // const likesArr = await Promise.all(
    //   likes.map(async (like: any) => {
    //     const user = await User.findOne({
    //       where: { id: like.userId },
    //     });

    //     const profilePic = await Profile_picture.findOne({
    //       where: { userId: like.userId },
    //     });

    //     return { ...user.dataValues, avatar: profilePic.mediaFileId };
    //   })
    // );

    return likes.length;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

// protected

async function getRecommendedFriends(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  console.log("get recommended friends ------------------->", req?.user);

  try {
    const usersNotFollowing = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: {
          [Op.notIn]: [
            Sequelize.literal(
              `(SELECT followingUserId FROM followers WHERE followerUserId = ${req?.user?.user?.id})`
            ),
          ],
        },
      },
      limit: 7,
    });
    console.log("REACHED HERE ***********************");
    const usersNotFollowingWithProfilePic = await Promise.all(
      usersNotFollowing.map(async (user: any) => {
        const profilePic = await Profile_picture.findOne({
          where: { userId: user.id },
        });

        return { ...user.dataValues, avatar: profilePic?.mediaFileId || null };
      })
    );

    res.status(200).send({ users: usersNotFollowingWithProfilePic });
  } catch (error) {
    res.status(400).send({ error: "Error getting recommended friends" });
    console.log(
      "ERROR getting recommended friends *******************************************"
    );
  }
}

export {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
  toggleLike,
  getRecommendedFriends,
};
