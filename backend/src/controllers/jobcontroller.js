import Job from "../models/Job.js";
import User from "../models/User.js";

// GET /api/jobs — all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/matches — jobs matching user skills
export const getMatchedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userSkills = user.skills || [];

    const jobs = await Job.find({});

    const matched = jobs.map((job) => {
      const matchedSkills = job.requiredSkills.filter((skill) =>
        userSkills.includes(skill)
      );
      const matchPercent = job.requiredSkills.length
        ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
        : 0;
      return {
        ...job._doc,
        matchedSkills,
        matchPercent,
      };
    });

    matched.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json(matched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs — add a job (admin only)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};