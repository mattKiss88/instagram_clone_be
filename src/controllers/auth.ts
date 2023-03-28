import { Request, Response, NextFunction } from "express";
import { uploadFile } from "../helpers/s3";
import fs from "fs";
import util from "util";
const bcrypt = require("bcrypt");
const { User, Profile_picture } = require("../../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const unlinkFile = util.promisify(fs.unlink);
import moment from "moment";
import { File } from "./types";

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("User not found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new Error("Invalid password");

    const accessToken: string | object = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.send({ accessToken, user });

    // .cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    //   expires: new Date(Date.now() + 90000000),
    // })

    // res.status(200).send({ success: true });
  } catch (err: unknown) {
    return res
      .status(400)
      .send(
        "Sorry, your password was incorrect. Please double-check your password."
      );
  }
}

interface FileRequest extends Request {
  file?: File;
}

async function createUser(req: FileRequest, res: Response, next: NextFunction) {
  try {
    const { email, password, username, fullName, dob, bio } = req.body.userData;

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const file: File | undefined = req?.file;

    let user = await User.create({
      email,
      password: hashedPassword,
      username,
      fullName,
      dob,
      bio,
    });

    user = {
      ...user.dataValues,
      dob: moment(user.dataValues.dob).format("YYYY-MM-DD"),
      profilePic: file?.filename ? file.filename : "default.png",
    };

    delete user.password;

    if (file?.filename) {
      await uploadFile(file);

      await Profile_picture.create({
        userId: user.id,
        mediaFileId: file.filename,
      });

      await unlinkFile(file.path);
    } else {
      await Profile_picture.create({
        userId: user.id,
        mediaFileId: "default.png",
      });
    }

    const accessToken: string | object = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).send({ user, token: accessToken });
    console.log("great success");
  } catch (err: unknown) {
    console.log(err);
    return res.status(400).send("Invalid email or password");
  }
}
export { getUser, createUser };
