import { Router } from "express";
import {
  getUser,
  followUser,
  searchUser,
  patchProfileImg,
  getFriends,
} from "../controllers/user";
import { authenticateToken as auth } from "../middleware/auth";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", auth, searchUser);
router.get("/friends", auth, getFriends);
router.get("/:id", auth, getUser);
router.post("/follow", auth, followUser);
router.patch("/profile-picture", auth, upload.single("image"), patchProfileImg);

export { router as userRouter };
