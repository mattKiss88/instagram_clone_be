import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getImage,
  getFeed,
  toggleLike,
  getRecommendedFriends,
  deletePost,
} from "../controllers/post";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import { authenticateToken as auth } from "../middleware/auth";

router.post("/", auth, upload.single("image"), createPost as any);
router.get("/recommended", auth, getRecommendedFriends);
router.get("/:id", auth, getAllPosts);
router.get("/image/:key", auth, getImage);
router.get("/feed/:id", auth, getFeed);
router.post("/like", auth, toggleLike);
router.delete("/:postId", auth, deletePost);

export { router as postRouter };
