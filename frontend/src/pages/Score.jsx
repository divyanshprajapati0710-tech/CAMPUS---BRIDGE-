import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getScore } from "../services/api";
import { ScoreSkeleton } from "../components/Skeleton";

function CircularRing({ score }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const getColor = (s) => {
    if (s >= 75) return "#22c55e";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2} className="absolute top-0 left-0 -rotate-90">
        <circle
          stroke="#b8d0e3"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={getColor(score)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (score / 100) * circumference,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <motion.span
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-navy-300 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function Score() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const { data } = await getScore();
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  const getScoreLabel = (score) => {
    if (score >= 75) return "Highly Employable 🌟";
    if (score >= 50) return "Moderately Employable 📈";
    if (score >= 25) return "Needs Improvement 💪";
    return "Just Getting Started 🚀";
  };

  if (loading) return <ScoreSkeleton />;

  return (
    <div className="min-h-screen bg-navy-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-navy-800 text-lg">Campus Bridge</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Dashboard</Link>
          <Link to="/assessment" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Assessment</Link>
          <Link to="/jobs" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Jobs</Link>
          <Link to="/profile" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Profile</Link>
          <button
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }}
            className="text-sm bg-navy-100 text-navy-700 px-4 py-1.5 rounded-lg hover:bg-navy-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-2xl font-bold text-navy-800">Score Report 📊</h2>
          <p className="text-navy-400 text-sm mt-1">Your employability analysis based on skills and academics.</p>
        </motion.div>

        {/* Score Card with Circular Ring */}
        <motion.div
          className="bg-navy-800 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Circular Ring */}
            <CircularRing score={data.score} />

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <motion.p
                className="text-navy-300 text-sm mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your Employability Score
              </motion.p>
              <motion.h3
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {getScoreLabel(data.score)}
              </motion.h3>
              <motion.p
                className="text-navy-300 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                You have {data.totalSkills} skills · Semester {data.semester}
              </motion.p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Skills", value: data.totalSkills },
                  { label: "Missing", value: data.missingSkills.length },
                  { label: "Semester", value: data.semester },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="bg-navy-700 rounded-xl p-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  >
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-navy-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.values(data.categories).map((cat, i) => (
            <motion.div
              key={cat.label}
              className="bg-navy-100 rounded-2xl p-6"
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-semibold text-navy-800 mb-1">{cat.label}</h3>
              <p className="text-xs text-navy-400 mb-3">
                {cat.userSkills.length} / {cat.skills.length} skills
              </p>
              <div className="bg-navy-200 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div
                  className="bg-navy-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((cat.userSkills.length / cat.skills.length) * 100)}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      cat.userSkills.includes(skill)
                        ? "bg-navy-800 text-white"
                        : "bg-white text-navy-400 border border-navy-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Missing Skills */}
        {data.missingSkills.length > 0 && (
          <motion.div
            className="bg-navy-100 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-semibold text-navy-800 mb-1">Skills to Learn 🎯</h3>
            <p className="text-xs text-navy-400 mb-4">
              Adding these skills will improve your employability score.
            </p>
            <div className="flex flex-wrap gap-2">
              {data.missingSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  className="text-sm px-3 py-1 rounded-full bg-white text-navy-600 border border-navy-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  + {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            onClick={() => navigate("/profile")}
            className="bg-navy-800 hover:bg-navy-900 text-white font-medium py-3 rounded-xl text-sm transition"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Add More Skills →
          </motion.button>
          <motion.button
            onClick={() => navigate("/jobs")}
            className="bg-navy-100 border border-navy-200 hover:bg-navy-200 text-navy-700 font-medium py-3 rounded-xl text-sm transition"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Browse Matching Jobs →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

export default Score;