// Import required dependencies and modules
import { Request, Response, NextFunction } from "express";
import { uploadFile } from "../helpers/s3";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);
const bcrypt = require("bcrypt");
const { User, Profile_picture, Follower, sequelize } = require("../../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
import moment from "moment";
import { File } from "./types";
import { Op } from "sequelize";
import { accessLog } from "../helpers/logger";
import createRandomFriendships from "../helpers/seedUser";
import Joi from "joi";

// Handler function to get user information

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract email and password from request body

    const { email, password } = req.body;

    // Find user in the database by email and include their profile picture

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Profile_picture,
          attributes: ["mediaFileId"],
        },
      ],
    });

    // If user not found, throw an error

    if (!user) throw new Error("User not found");

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);

    // If password is invalid, throw an error
    if (!validPassword) throw new Error("Invalid password");

    // find user followers

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

    // Generate access token using user information

    const accessToken: string | object = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Send response with access token and user information
    res.send({ accessToken, user, followingUsers });

    // .cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    //   expires: new Date(Date.now() + 90000000),
    // })

    // res.status(200).send({ success: true });
  } catch (err: unknown) {
    // If error occurs, send error message in response
    console.log(err);

    accessLog("LOGIN USER ERROR", err);

    next(err);
  }
}

// Interface to extend Request type with File property
interface FileRequest extends Request {
  file?: File;
}

type UserData = {
  email: string;
  password: string;
  username: string;
  fullName?: string;
  dob?: Date | string; // depending on how you handle dates
  bio?: string;
};

async function createUser(req: FileRequest, res: Response, next: NextFunction) {
  const UserDataSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    username: Joi.string().required(),
    fullName: Joi.alternatives().try(Joi.string(), Joi.valid(null)).optional(),
    dob: Joi.alternatives().try(Joi.string(), Joi.valid(null)).optional(),
    bio: Joi.alternatives().try(Joi.string(), Joi.valid(null)).optional(),
  });

  const userObject = req.body.userData;

  const validationResult = UserDataSchema.validate(userObject);

  try {
    if (validationResult.error) {
      console.log("Validation error:", validationResult.error.details);
      // Respond with an error, for example:

      throw new Error("Invalid data format");
    }

    const { email, password, username, fullName, dob, bio } = req.body
      .userData as UserData;

    // Check if user already exists

    let existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("User already exists");
      }
      if (existingUser.username === username) {
        throw new Error("Username already exists");
      }
    }

    // Hash password

    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Get uploaded file from request

    const file: File | undefined = req?.file;

    // Create user in the database

    const userInstance = await User.create({
      email,
      password: hashedPassword,
      username,
      fullName: fullName ? fullName : null,
      dob: dob ? dob : null,
      bio: bio ? bio : null,
    });

    // Format user data and update profile picture

    const user = {
      ...userInstance.dataValues,
      dob: userInstance.dataValues.dob
        ? moment(userInstance.dataValues.dob).format("YYYY-MM-DD")
        : null,
      avatar: file?.filename ? file.filename : "default.png",
    };

    delete user.password;

    // If file is uploaded, upload to S3, update profile picture entry, and delete local file

    if (file?.filename) {
      await uploadFile(file);

      await Profile_picture.create({
        userId: user.id,
        mediaFileId: file.filename,
      });

      await unlinkFile(file.path);
    } else {
      // If file is not uploaded, set default profile picture
      await Profile_picture.create({
        userId: user.id,
        mediaFileId: "default.png",
      });
    }

    // Give user  default followers

    await createRandomFriendships(user.id, 10);

    // Generate access token using user information

    const accessToken: string | object = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).send({ user, token: accessToken });
  } catch (err: any) {
    console.log(err, "error creating user");
    next(err);

    // return res.status(400).send({
    //   message: err?.message ? err?.message : "Error, please try again.",
    // });
  }
}
export { getUser, createUser };
