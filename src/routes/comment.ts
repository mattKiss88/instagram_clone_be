import { Router } from "express";
import {
  addComment,
  getCommentsByPostId,
  toggleCommentLike,
} from "../controllers/comment";
import { authenticateToken as auth } from "../middleware/auth";
const router = Router();

router.post("/post/like", auth, toggleCommentLike);
router.post("/:post_id", auth, addComment);
router.get("/:post_id", auth, getCommentsByPostId);

export { router as commentRouter };
