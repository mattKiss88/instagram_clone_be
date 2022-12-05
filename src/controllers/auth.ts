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

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("User not found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new Error("Invalid password");

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);

    res.send({ accessToken });
  } catch {
    return res.status(400).send("Invalid email or password");
  }
}

async function createUser(req: any, res: Response, next: NextFunction) {
  try {
    const { email, password, username, fullName, dob, bio } = JSON.parse(
      req.body.userData
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const file = req.file;

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
      profilePic: file.filename || null,
    };

    delete user.password;

    if (file) {
      await uploadFile(file);

      await Profile_picture.create({
        userId: user.id,
        mediaFileId: file.filename,
      });

      await unlinkFile(file.path);
    }

    // const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).send({ user });
    console.log("great success");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid email or password");
  }
}
export { getUser, createUser };
