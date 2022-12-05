import { Router } from "express";
import { getUser } from "../controllers/user";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/:id", getUser);

export { router as userRouter };
