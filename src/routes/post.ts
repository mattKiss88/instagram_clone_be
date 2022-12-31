import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
} from "../controllers/post";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createPost);
router.get("/:id", getAllPosts);
router.get("/image/:key", getImage);
router.get("/feed/:id", getFeed);

export { router as postRouter };
