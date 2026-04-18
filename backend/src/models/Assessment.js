import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testType: {
      type: String,
      enum: ["technical", "aptitude", "softskills"],
      required: true,
    },
    branch: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    weakAreas: [{ type: String }],
    strongAreas: [{ type: String }],
    roadmap: [{ type: String }],
    answers: [
      {
        questionId: String,
        selected: String,
        correct: String,
        isCorrect: Boolean,
        topic: String,
      },
    ],
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;