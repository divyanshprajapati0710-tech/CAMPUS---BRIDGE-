import express from "express";
import { getScore } from "../controllers/scoreController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getScore);

export default router;