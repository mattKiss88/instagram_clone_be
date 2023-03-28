import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
const { Op } = require("sequelize");

const { Post, User, Profile_picture, Follower } = require("../../models");
require("dotenv").config();

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    let user = await User.findOne({
      where: { id },
    });

    user = user.dataValues;

    delete user.password;

    let userDetails = await getUserDetails(user.id);

    const isFollowing = await Follower.findOne({
      where: {
        followerUserId: req?.user?.id,
        followingUserId: id,
      },
    });

    res.status(201).send({
      user: {
        ...userDetails,
        isFollowing: !!isFollowing,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function followUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userObj = req?.user;

    // check if user is already following

    const following = await Follower.findOne({
      where: {
        followerUserId: userObj?.id,
        followingUserId: req.body?.userId,
      },
    });

    if (following) {
      // return res.status(400).send("You are already following this user");

      await Follower.destroy({
        where: {
          followerUserId: userObj?.id,
          followingUserId: req.body?.userId,
        },
      });

      return res.status(201).send("Unfollowed");
    }

    const follow = await Follower.create({
      followerUserId: userObj?.id,
      followingUserId: req.body.userId,
      createdAt: new Date(),
    });

    res.status(201).send({ follow });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function searchUser(req: Request, res: Response, next: NextFunction) {
  const { search } = req.query;

  search?.length === 0 && res.status(201).send([]);
  try {
    // return all users
    // const filterUsers = User.findAll({
    //   // where : {
    //   //   username:
    //   // }
    // });

    const filterUsers = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    res.status(201).send(filterUsers);
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
}
export { getUser, followUser, searchUser };
