import { Router } from "express";
import { seedDatabase, resetDatabase } from "../controllers/testing";
const router = Router();

router.post("/reset-database", resetDatabase);
router.post("/seed-database", seedDatabase);

export { router as testRouter };
