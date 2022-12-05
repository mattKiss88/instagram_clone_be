import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
import fs from "fs";
import util from "util";
const { Post, Post_media, User, Profile_picture } = require("../../models");
require("dotenv").config();
const unlinkFile = util.promisify(fs.unlink);

async function createPost(req: any, res: Response, next: NextFunction) {
  try {
    const post = await Post.create({
      caption: req.body.caption,
      userId: req.body.userId,
    });

    const file = req.file;

    await uploadFile(file);

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
    console.log(id);
    const posts = await Post.findAll({
      where: { userId: id },
    });

    console.log(posts);

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
      user: { username: user.username, avatar: profilePic.mediaFileId },
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
    console.log(error);
    res.status(400).send(error);
  }
}

export { createPost, getAllPosts, getImage };
