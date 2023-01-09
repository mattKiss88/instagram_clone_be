import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
  toggleLike,
} from "../controllers/post";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createPost);
router.get("/:id", getAllPosts);
router.get("/image/:key", getImage);
router.get("/feed/:id", getFeed);
router.post("/like", toggleLike);

export { router as postRouter };
