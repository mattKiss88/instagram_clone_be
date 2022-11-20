import express from "express";
import bodyParser from "body-parser";
import { uploadFile } from "./s3";
import { Request, Response } from "express";
const { Post, Image } = require("../models");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const port = 3001;

require("dotenv").config();

const cors = require("cors");
let corsOptions: object;

corsOptions = {
  origin: ["*", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessState: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`Hello from Instagram! Running on port ${port}`);
});

app.post("/image", upload.single("image"), async (req: any, res: Response) => {
  try {
    const post = await Post.create({
      caption: req.body.caption,
      userId: req.body.userId,
      likes: 0,
    });

    const file = req.file;
    let a = file.toBlob();
    console.log(a);
    const response = await uploadFile(a);
    const image = await Image.create({
      postId: post.id,
      key: file.filename,
    });

    res.status(201).send({ post, image });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default app;
