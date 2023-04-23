import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
import { uploadFile } from "../helpers/s3";
const { Op } = require("sequelize");
import fs from "fs";
import util from "util";
import { accessLog } from "../helpers/logger";
const unlinkFile = util.promisify(fs.unlink);

const { Post, User, Profile_picture, Follower } = require("../../models");
require("dotenv").config();

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    let user = await User.findOne({
      attributes: { exclude: ["password"] },
      raw: true,
      where: { id },
    });

    let userDetails = await getUserDetails(user.id, req?.user?.id);

    userDetails = {
      ...userDetails,
      password: undefined, // Exclude password from userDetails
    };

    const isFollowing = await Follower.findOne({
      where: {
        followerUserId: req?.user?.id,
        followingUserId: id,
      },
    });

    let followingUsers = await Follower.findAll({
      where: {
        followerUserId: user.id,
      },
      attributes: ["followingUserId"],
    });

    console.log(followingUsers);

    followingUsers = followingUsers.map(
      (user: { followingUserId: number }) => user.followingUserId
    );

    res.status(200).send({
      user: {
        ...userDetails,
        isFollowing: !!isFollowing,
      },
      followingUsers,
    });
  } catch (error: unknown) {
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

      return res.status(200).send({
        msg: "You have unfollowed this user",
      });
    }

    const follow = await Follower.create({
      followerUserId: userObj?.id,
      followingUserId: req.body.userId,
      createdAt: new Date(),
    });

    res.status(201).send({ follow, msg: "You are now following this user" });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function searchUser(req: Request, res: Response, next: NextFunction) {
  const { search } = req.query;
  const { username, fullName } = req.user ?? {};

  accessLog(`Psearch error`, req.user);

  try {
    const filterUsers = await User.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: `%${(search as string)?.toLowerCase()}%`,
              [Op.ne]: username,
            },
          },
          {
            fullName: {
              [Op.like]: `%${(search as string)?.toLowerCase()}%`,
              [Op.ne]: fullName,
            },
          },
        ],
      },
      include: [
        {
          model: Profile_picture,
          attributes: ["mediaFileId"],
        },
      ],
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]],
    });

    res.status(200).send(filterUsers);
  } catch (error: unknown) {
    console.error(error);

    res.status(500).send("Error searching for users");
  }
}

interface FileRequest extends Request {
  file?: File;
}

async function patchProfileImg(req: FileRequest, res: Response) {
  const userId = req?.user?.id;
  const file: any = req?.file;

  try {
    const profilePic = await Profile_picture.findOne({
      where: {
        userId,
      },
    });

    await uploadFile(file);

    if (profilePic) {
      await Profile_picture.update(
        {
          mediaFileId: file.filename,
        },
        {
          where: {
            userId,
          },
        }
      );
    } else {
      await Profile_picture.create({
        userId,
        mediaFileId: file.filename,
      });
    }
    await unlinkFile(file.path);

    res
      .status(201)
      .send({ message: "Profile picture updated", avatar: file.filename });
  } catch (error: unknown) {
    accessLog(`PATCH Profile Picture Error`, error);

    return res.status(400).send("No file uploaded");
  }
}

// get friends list
async function getFriends(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req?.user?.id;
    const { limit } = req.query;

    let followingUsers = await Follower.findAll({
      where: {
        followerUserId: id,
      },
      limit: limit ? parseInt(limit as string) : 10,
    });

    // map through the following users and get the user details
    followingUsers = await Promise.all(
      followingUsers.map(async (user: { followingUserId: number }) => {
        let userDetails = await getUserDetails(user.followingUserId);

        return userDetails;
      })
    );

    res.status(201).send({ followingUsers });
  } catch (error: unknown) {
    console.log(error);
    accessLog(`GET Friends List Error`, error);
    res.status(400).send();
  }
}

export { getUser, followUser, searchUser, patchProfileImg, getFriends };
