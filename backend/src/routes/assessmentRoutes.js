import express from "express";
import {
  getQuestions,
  submitAssessment,
  getHistory,
} from "../controllers/assessmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions/:type", protect, getQuestions);
router.post("/submit", protect, submitAssessment);
router.get("/history", protect, getHistory);

export default router;