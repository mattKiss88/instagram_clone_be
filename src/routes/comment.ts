import { Router } from "express";
import {
  addComment,
  getCommentsByPostId,
  toggleCommentLike,
} from "../controllers/comment";
import { authRouter } from "./auth";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import { authenticateToken as auth } from "../middleware/auth";

router.post("/post/like", auth, toggleCommentLike);
router.post("/:post_id", auth, addComment);
router.get("/:post_id", auth, getCommentsByPostId);

export { router as commentRouter };
