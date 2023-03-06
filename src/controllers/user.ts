import { Request, Response, NextFunction } from "express";

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

    const profilePic = await Profile_picture.findOne({
      where: { userId: id },
    });

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

async function followUser(req: any, res: Response, next: NextFunction) {
  try {
    const userObj = req.user.user;

    // check if user is already following

    const following = await Follower.findOne({
      where: {
        followerUserId: userObj?.id,
        followingUserId: req.body?.userId,
      },
    });

    if (following) {
      return res.status(400).send("You are already following this user");
    }

    const follow = await Follower.create({
      followerUserId: userObj.id,
      followingUserId: req.body.userId,
      createdAt: new Date(),
    });

    res.status(201).send({ follow });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export { getUser, followUser };
