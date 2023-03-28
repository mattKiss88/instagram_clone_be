import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
import fs from "fs";
import util from "util";
import { Op, Sequelize } from "sequelize";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
import { accessLog } from "../helpers/logger";
import { File, IPost, IPost_media, IUser } from "./types";
const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
  Post_likes,
  Filter,
  Comment,
} = require("../../models");
require("dotenv").config();
const unlinkFile = util.promisify(fs.unlink);

interface FileRequest extends Request {
  file: File;
}

async function createPost(req: FileRequest, res: Response, next: NextFunction) {
  try {
    const file: File = req.file;

    await uploadFile(file);

    const post = await Post.create({
      caption: req.body.caption,
      userId: req.user.id,
    });

    // find filter by name
    const filter = await Filter.findOne({
      where: { filterName: req.body.filter },
    });

    const image = await Post_media.create({
      postId: post.id,
      mediaFileId: file.filename,
      position: 1,
      filterId: filter?.id || null,
    });

    await unlinkFile(file.path);

    res.status(201).send({ post, image });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getAllPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    !id && res.status(400).send("id is required");

    const posts = await Post.findAll({
      raw: true,
      where: { userId: id },
    });

    const postArr = await Promise.all(
      posts.map(async (post: IPost) => {
        const images: IPost_media[] = await Post_media.findAll({
          raw: true,
          where: { postId: post.id },
        });

        // get image filter

        const filter = await Filter.findOne({
          where: { id: images[0]?.filterId || null },
        });

        accessLog("filter", { filter, images });

        // get comment count

        const commentCount: number = await Comment.count({
          where: { postId: post.id },
        });

        // get like count

        const likeCount: number = await Post_likes.count({
          where: { postId: post.id },
        });

        return {
          post: { ...post, commentCount, likeCount },
          images: images.map((image: IPost_media) => {
            return {
              ...image,
              filter: filter?.filterName || null,
            };
          }),
        };
      })
    );

    const user: IUser = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id },
      raw: true,
    });

    console.log("--------------------->user", user);

    const profilePic = await Profile_picture.findOne({
      where: { userId: id },
    });

    const following = await Follower.findOne({
      where: {
        followerUserId: id,
        followingUserId: req.user.id,
      },
    });

    res.status(201).send({
      posts: postArr,
      user: {
        ...user,
        avatar: profilePic?.mediaFileId,
        following: !!following,
      },
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;

    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (error) {
    console.log("img err", error);
    res.status(400).send(error);
  }
}

// export interface UserRequest extends Request {
//   user?: any;
// }
async function getFeed(req: Request, res: Response, next: NextFunction) {
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

        const postArr = await Promise.all(
          posts.map(async (post: any) => {
            const images = await Post_media.findAll({
              where: { postId: post.id },
            });

            // get image filter
            const filter = await Filter.findOne({
              where: { id: images[0]?.filterId || null },
            });

            accessLog("filter", filter);

            const likeCount = await Post_likes.findAll({
              where: { postId: post.id },
            });

            const likesPost = await Post_likes.findOne({
              where: { postId: post.id, userId: id },
            });

            const userDetails = await getUserDetails(post?.userId);

            return {
              post: {
                ...post.dataValues,
                likeCount: likeCount.length,
                likes: likesPost ? true : false,
              },
              images: images.map((image: any) => {
                return {
                  ...image.dataValues,
                  filter: filter?.filterName,
                };
              }),
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
    console.log(error, "-------------------------get feed error");
    res.status(400).send(error);
  }
}

async function toggleLike(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId, userId } = req.body;

    const like = await Post_likes.findOne({
      where: { postId, userId },
    });

    let likeAction;

    if (like) {
      likeAction = await unlikePost(postId, userId);
    } else {
      likeAction = await likePost(postId, userId);
    }

    res.status(201).send({ data: likeAction });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function likePost(postId: number, userId: number) {
  try {
    const like = await Post_likes.create({
      postId,
      userId,
    });

    return like;
  } catch (error: unknown) {
    console.log(error);
  }
}

async function unlikePost(postId: number, userId: number) {
  try {
    const like = await Post_likes.destroy({
      where: { postId, userId },
    });

    return like;
  } catch (error: unknown) {
    console.log(error);
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
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usersNotFollowing = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: {
          [Op.notIn]: [
            Sequelize.literal(
              `(SELECT followingUserId FROM followers WHERE followerUserId = ${req?.user?.id})`
            ),
          ],
        },
      },
      limit: 7,
    });

    const usersNotFollowingDetails = await Promise.all(
      usersNotFollowing.map(async (user: IUser) => {
        const userDetails = await getUserDetails(user.id);

        return { ...userDetails };
      })
    );

    res.status(200).send({ users: usersNotFollowingDetails });
  } catch (error: unknown) {
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
