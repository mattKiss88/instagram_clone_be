import { Router } from "express";
import { createPost, getAllPosts, getImage } from "../controllers/post";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createPost);
router.get("/:id", getAllPosts);
router.get("/image/:key", getImage);

export { router as postRouter };
