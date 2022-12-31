import { Router } from "express";
import { addComment, getCommentsByPostId } from "../controllers/comment";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/:post_id", addComment);
router.get("/:post_id", getCommentsByPostId);

export { router as commentRouter };
