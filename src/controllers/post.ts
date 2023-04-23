import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
import fs, { access } from "fs";
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

async function createPost(req: FileRequest, res: Response) {
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

    const user = await getUserDetails(req.user.id);

    await unlinkFile(file.path);

    res.status(201).send({
      post: { ...post.dataValues, isLiked: false, likeCount: 0 },
      images: [image],
      user,
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getAllPosts(req: Request, res: Response) {
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

        // get comment count

        const commentCount: number = await Comment.count({
          where: { postId: post.id },
        });

        // get like count

        const likeCount: number = await Post_likes.count({
          where: { postId: post.id },
        });

        // LOGGED IN USER LIKES

        const isLiked = await Post_likes.findOne({
          where: {
            postId: post.id,
            userId: req.user.id,
          },
        });

        return {
          post: { ...post, commentCount, likeCount, isLiked: !!isLiked },
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

async function getImage(req: Request, res: Response) {
  try {
    const { key } = req.params;

    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (error) {
    console.log("img err", error);
    res.status(400).send(error);
  }
}

async function getFeed(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const following = await Follower.findAll({ where: { followerUserId: id } });
    const followingUserIds = following.map((user: any) => user.followingUserId);
    // add current user id to get his posts
    followingUserIds.push(id);

    const allPosts = await Post.findAll({
      raw: true,
      where: { userId: { [Op.in]: followingUserIds } },
      order: [["createdAt", "DESC"]],
    });

    const startIndex = ((page as number) - 1) * (limit as number);
    const endIndex = startIndex + parseInt(limit as string, 10);

    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    const feedArr = await Promise.all(
      paginatedPosts.map(async (post: any) => {
        const [images, likeCount, likesPost, userDetails] = await Promise.all([
          Post_media.findAll({ raw: true, where: { postId: post.id } }),
          Post_likes.count({ where: { postId: post.id } }),
          Post_likes.findOne({ where: { postId: post.id, userId: id } }),
          getUserDetails(post.userId),
        ]);

        const filter = await Filter.findOne({
          where: { id: images[0]?.filterId || null },
        });

        accessLog("filter", filter);

        return {
          post: { ...post, likeCount, isLiked: !!likesPost },
          images: images.map((image: any) => ({
            ...image,
            filter: filter?.filterName,
          })),
          user: userDetails,
        };
      })
    );

    res.cookie("name", "express").send({ feed: feedArr });
  } catch (error) {
    console.log(error, "-------------------------get feed error");
    res.status(400).send(error);
  }
}

async function toggleLike(req: Request, res: Response) {
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

async function getRecommendedFriends(req: Request, res: Response) {
  try {
    const usersNotFollowing = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [
            Sequelize.literal(
              `(SELECT followingUserId FROM followers WHERE followerUserId = ${req?.user?.id})`
            ),
          ],
          [Op.ne]: req?.user?.id,
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
    accessLog(`GET Recommended Friends Error`, error);
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    accessLog(`DELETE Post Error`, postId);

    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(400).send({ error: "Post not found" });
    }

    if (post.userId !== req?.user?.id) {
      return res.status(400).send({ error: "Unauthorized" });
    }

    const deletedPost = await Post.destroy({
      where: { id: postId },
    });

    res.status(200).send({ data: deletedPost });
  } catch (error: unknown) {
    res.status(400).send({ error: "Error deleting post" });
    accessLog(`DELETE Post Error`, error);
  }
}

export {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
  toggleLike,
  getRecommendedFriends,
  deletePost,
};
