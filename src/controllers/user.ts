import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";

const { Post, User, Profile_picture, Follower } = require("../../models");
require("dotenv").config();

async function getUser(req: any, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    let user = await User.findOne({
      where: { id },
    });

    user = user.dataValues;

    delete user.password;

    console.log(id, "----------------------------------");

    const profilePic = await Profile_picture.findOne({
      where: { userId: id },
    });

    console.log(profilePic, "11----------------------------------");

    const posts = await Post.findAll({
      where: { userId: id },
    });

    const followers = await Follower.findAll({
      where: { followerUserId: id },
    });

    const following = await Follower.findAll({
      where: { followingUserId: id },
    });

    res.status(201).send({
      user: {
        ...user,
        avatar: profilePic.mediaFileId,
        posts: posts.length,
        followers: followers.length,
        following: following.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export { getUser };
