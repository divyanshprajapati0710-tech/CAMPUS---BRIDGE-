import express from "express";
import { getJobs, getMatchedJobs, createJob } from "../controllers/jobcontroller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.get("/matches", protect, getMatchedJobs);
router.post("/", protect, createJob);

export default router;
