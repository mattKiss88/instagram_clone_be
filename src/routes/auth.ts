import { Router } from "express";
import { getUser, createUser } from "../controllers/auth";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/login", getUser);
router.post("/signup", upload.single("image"), createUser);

export { router as authRouter };
