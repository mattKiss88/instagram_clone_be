import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
import fs from "fs";
import util from "util";
const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
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
    });

    const profilePic = await Profile_picture.findOne({
      where: { userId: id },
    });

    res.status(201).send({
      posts: postArr,
      user: { username: user.username, avatar: profilePic?.mediaFileId },
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

async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    console.log(id, "---------------------------------->");
    const following = await Follower.findAll({
      where: { followerUserId: id },
    });

    console.log(following, "ff---------------------------------->");

    const feedArr = await Promise.all(
      following.map(async (user: any) => {
        console.log(user.id, "user---------------------------------->");
        const posts = await Post.findAll({
          where: { userId: user?.followingUserId },
        });

        console.log(posts, "posts---------------------------------->");

        const postArr = await Promise.all(
          posts.map(async (post: any) => {
            const images = await Post_media.findAll({
              where: { postId: post.id },
            });

            const user = await User.findOne({
              where: { id: post.userId },
            });

            console.log(user, "user ----------------------------------->");

            const profilePic = await Profile_picture.findOne({
              where: { userId: post.userId },
            });

            return {
              post,
              images,
              user: { ...user.dataValues, avatar: profilePic.mediaFileId },
            };
          })
          // .sort((a: any, b: any) => a.post.createdAt - b.post.createdAt)
        );

        return postArr;
      })
    )
      .then((array) => {
        console.log(array, "array---------------------------------->");
        return array
          .flat(1)
          .sort((a: any, b: any) => a.post.createdAt - b.post.createdAt);
      })
      .catch((err) => console.log("zzzzz", err));

    res.status(201).send({
      feed: feedArr,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export { createPost, getAllPosts, getImage, getFeed };
