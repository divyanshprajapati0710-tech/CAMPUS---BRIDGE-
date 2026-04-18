import User from "../models/User.js";

const industrySkills = [
  "Python", "JavaScript", "React.js", "Node.js", "MongoDB",
  "SQL", "Machine Learning", "Deep Learning", "Data Analysis",
  "Java", "C++", "HTML/CSS", "Git", "Docker", "AWS",
  "Communication", "Problem Solving", "Team Work", "Leadership"
];

const calculateScore = (skills, semester) => {
  const skillScore = Math.round((skills.length / industrySkills.length) * 70);
  const semesterBonus = Math.min(semester * 2, 20);
  const profileBonus = skills.length > 0 ? 10 : 0;
  return Math.min(skillScore + semesterBonus + profileBonus, 100);
};

// GET /api/score
export const getScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skills = user.skills || [];
    const semester = user.semester || 1;

    const score = calculateScore(skills, semester);

    // Update score in DB
    user.employabilityScore = score;
    await user.save();

    const missingSkills = industrySkills.filter(
      (skill) => !skills.includes(skill)
    );

    const categories = {
      technical: {
        label: "Technical Skills",
        skills: ["Python", "JavaScript", "React.js", "Node.js", "MongoDB", "SQL", "Java", "C++", "HTML/CSS", "Git", "Docker", "AWS"],
        userSkills: skills.filter(s => ["Python", "JavaScript", "React.js", "Node.js", "MongoDB", "SQL", "Java", "C++", "HTML/CSS", "Git", "Docker", "AWS"].includes(s)),
      },
      ml: {
        label: "AI & ML Skills",
        skills: ["Machine Learning", "Deep Learning", "Data Analysis"],
        userSkills: skills.filter(s => ["Machine Learning", "Deep Learning", "Data Analysis"].includes(s)),
      },
      soft: {
        label: "Soft Skills",
        skills: ["Communication", "Problem Solving", "Team Work", "Leadership"],
        userSkills: skills.filter(s => ["Communication", "Problem Solving", "Team Work", "Leadership"].includes(s)),
      },
    };

    res.json({
      score,
      totalSkills: skills.length,
      missingSkills,
      categories,
      semester,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};