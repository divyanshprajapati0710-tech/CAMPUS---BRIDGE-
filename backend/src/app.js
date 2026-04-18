import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/assessment", assessmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Campus Bridge API is running 🚀" });
});

export default app;