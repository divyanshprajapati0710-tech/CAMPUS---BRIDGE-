import Assessment from "../models/Assessment.js";
import { questions, roadmaps } from "../config/questions.js";

// Store generated questions temporarily (in memory)
const questionCache = new Map();

// GET /api/assessment/questions/:type
export const getQuestions = async (req, res) => {
  try {
    const { type } = req.params;
    const branch = req.query.branch || "AIDS";
    const userId = req.user._id.toString();

    let allQuestions;

    if (type === "technical") {
      allQuestions = questions.technical[branch] || questions.technical["AIDS"];
    } else if (type === "aptitude") {
      allQuestions = questions.aptitude;
    } else if (type === "softskills") {
      allQuestions = questions.softskills;
    } else {
      return res.status(400).json({ message: "Invalid test type" });
    }

    // Randomly shuffle and pick 10 questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10).map((q, i) => ({
      ...q,
      id: `q${i + 1}`,
    }));

    // Store in cache for grading
    const cacheKey = `${userId}-${type}`;
    questionCache.set(cacheKey, selected);

    // Send without answers
    const sanitized = selected.map(({ answer, ...rest }) => rest);
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/assessment/submit
export const submitAssessment = async (req, res) => {
  try {
    const { testType, branch, userAnswers } = req.body;
    const userId = req.user._id.toString();

    // Get questions from cache (with answers)
    const cacheKey = `${userId}-${testType}`;
    let qs = questionCache.get(cacheKey);

    // Fallback to static if cache miss
    if (!qs) {
      if (testType === "technical") {
        qs = questions.technical[branch] || questions.technical["AIDS"];
      } else if (testType === "aptitude") {
        qs = questions.aptitude;
      } else {
        qs = questions.softskills;
      }
      const shuffled = [...qs].sort(() => Math.random() - 0.5);
      qs = shuffled.slice(0, 10).map((q, i) => ({ ...q, id: `q${i + 1}` }));
    }

    // Clear cache after use
    questionCache.delete(cacheKey);

    // Grade answers
    let correct = 0;
    const answers = [];
    const topicScores = {};

    qs.forEach((q) => {
      const selected = userAnswers[q.id] || "";
      const isCorrect = selected === q.answer;
      if (isCorrect) correct++;

      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { correct: 0, total: 0 };
      }
      topicScores[q.topic].total++;
      if (isCorrect) topicScores[q.topic].correct++;

      answers.push({
        questionId: q.id,
        selected,
        correct: q.answer,
        isCorrect,
        topic: q.topic,
      });
    });

    const score = Math.round((correct / qs.length) * 100);

    // Find weak and strong areas
    const weakAreas = [];
    const strongAreas = [];

    Object.entries(topicScores).forEach(([topic, data]) => {
      const percent = (data.correct / data.total) * 100;
      if (percent < 50) weakAreas.push(topic);
      else strongAreas.push(topic);
    });

    // Generate roadmap with videos
    const roadmapData = weakAreas.map((area) => {
      const rm = roadmaps[area];
      if (rm && rm.steps) {
        return {
          topic: area,
          steps: rm.steps,
          videos: rm.videos || [],
        };
      }
      return {
        topic: area,
        steps: [
          `Study ${area} fundamentals thoroughly`,
          `Practice ${area} problems daily`,
          `Build a project using ${area} concepts`,
        ],
        videos: [],
      };
    });

    // Save assessment
    const assessment = await Assessment.create({
      user: req.user._id,
      testType,
      branch,
      score,
      totalQuestions: qs.length,
      correctAnswers: correct,
      weakAreas,
      strongAreas,
      roadmap: weakAreas.map((area) => roadmaps[area]?.steps?.[0] || area),
      answers,
    });

    // Get past assessments for comparison
    const past = await Assessment.find({
      user: req.user._id,
      testType,
      _id: { $ne: assessment._id },
    }).sort({ createdAt: -1 }).limit(1);

    let comparison = null;
    if (past.length > 0) {
      const prev = past[0];
      comparison = {
        previousScore: prev.score,
        currentScore: score,
        improved: score > prev.score,
        difference: score - prev.score,
        newlyStrong: strongAreas.filter((a) => prev.weakAreas.includes(a)),
        stillWeak: weakAreas.filter((a) => prev.weakAreas.includes(a)),
      };
    }

    res.json({
      score,
      correctAnswers: correct,
      totalQuestions: qs.length,
      weakAreas,
      strongAreas,
      roadmapData,
      answers,
      comparison,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/assessment/history
export const getHistory = async (req, res) => {
  try {
    const history = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-answers");
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};