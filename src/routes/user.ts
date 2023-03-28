import { Router } from "express";
import { getUser, followUser, searchUser } from "../controllers/user";
import { authenticateToken as auth } from "../middleware/auth";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", auth, searchUser);
router.get("/:id", auth, getUser);
router.post("/follow", auth, followUser);

export { router as userRouter };
