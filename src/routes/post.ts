import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
  toggleLike,
  getRecommendedFriends,
} from "../controllers/post";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import { authenticateToken as auth } from "../middleware/auth";

router.post("/", auth, upload.single("image"), createPost);
router.get("/recommended", auth, getRecommendedFriends);
router.get("/:id", auth, getAllPosts);
router.get("/image/:key", auth, getImage);
router.get("/feed/:id", auth, getFeed);
router.post("/like", auth, toggleLike);

export { router as postRouter };
