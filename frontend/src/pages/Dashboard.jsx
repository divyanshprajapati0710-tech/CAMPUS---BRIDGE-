import ProgressChart from "../components/ProgressChart";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProfile, getMatchedJobs } from "../services/api";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedButton from "../components/AnimatedButton";
import { DashboardSkeleton } from "../components/Skeleton";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        const { data } = await getProfile();
        setUser(data);
      } catch (err) { navigate("/login"); }
    };
    const fetchJobs = async () => {
      try {
        const { data } = await getMatchedJobs();
        setJobCount(data.filter((j) => j.matchPercent > 0).length);
      } catch (err) {}
    };
    fetchData();
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-navy-50">

      {/* Navbar */}
      <motion.nav
        className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-navy-800 text-lg">Campus Bridge</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/assessment" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Assessment</Link>
          <Link to="/jobs" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Jobs</Link>
          <Link to="/score" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Score</Link>
          <Link to="/profile" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">Profile</Link>
          <AnimatedButton
            onClick={handleLogout}
            className="text-sm bg-navy-100 text-navy-700 px-4 py-1.5 rounded-lg hover:bg-navy-200 transition font-medium"
          >
            Logout
          </AnimatedButton>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Welcome Banner */}
        <AnimatedCard
          className="bg-navy-800 rounded-2xl p-8 text-white mb-8"
          delay={0.1}
        >
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name}! 🎓</h2>
          <p className="text-navy-200 text-sm">Track your career readiness and bridge the gap to your dream job.</p>
        </AnimatedCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard className="bg-navy-100 rounded-2xl p-6" delay={0.15}>
            <p className="text-sm text-navy-500 mb-1">Employability Score</p>
            <div className="flex items-end gap-2">
              <motion.span
                className="text-4xl font-bold text-navy-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {user.employabilityScore || 0}
              </motion.span>
              <span className="text-navy-400 text-sm mb-1">/ 100</span>
            </div>
            <div className="mt-3 bg-navy-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-navy-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${user.employabilityScore || 0}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-navy-400 mt-2">Complete your profile to get scored</p>
          </AnimatedCard>

          <AnimatedCard className="bg-navy-100 rounded-2xl p-6" delay={0.2}>
            <p className="text-sm text-navy-500 mb-1">Skills Added</p>
            <motion.span
              className="text-4xl font-bold text-navy-800"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
            >
              {user.skills?.length || 0}
            </motion.span>
            <div className="flex flex-wrap gap-1 mt-3">
              {user.skills?.slice(0, 3).map((skill, i) => (
                <motion.span
                  key={skill}
                  className="text-xs bg-navy-200 text-navy-700 px-2 py-0.5 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
              {user.skills?.length > 3 && (
                <span className="text-xs text-navy-400">+{user.skills.length - 3} more</span>
              )}
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-navy-100 rounded-2xl p-6" delay={0.25}>
            <p className="text-sm text-navy-500 mb-1">Job Matches</p>
            <motion.span
              className="text-4xl font-bold text-navy-800"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {jobCount}
            </motion.span>
            <p className="text-xs text-navy-400 mt-4">
              {jobCount > 0 ? "Jobs matching your skills" : "Update profile to see matches"}
            </p>
          </AnimatedCard>
        </div>

        {/* Progress Chart */}
        <ProgressChart />

        {/* Profile Info */}
        <AnimatedCard className="bg-navy-100 rounded-2xl p-6 mb-8" delay={0.3}>
          <h3 className="font-semibold text-navy-800 mb-4">Your Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-navy-400">Email</p>
              <p className="text-sm font-medium text-navy-800">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-navy-400">Role</p>
              <p className="text-sm font-medium text-navy-800 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-navy-400">Department</p>
              <p className="text-sm font-medium text-navy-800">{user.department || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-navy-400">Semester</p>
              <p className="text-sm font-medium text-navy-800">
                {user.semester ? `Semester ${user.semester}` : "Not set"}
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: "📝", label: "Complete Profile", desc: "Add your skills and academics", path: "/profile", delay: 0.35 },
            { icon: "🎯", label: "Take Assessment", desc: "Test your technical & soft skills", path: "/assessment", delay: 0.4 },
            { icon: "💼", label: "Browse Jobs", desc: "Find matching opportunities", path: "/jobs", delay: 0.45 },
            { icon: "📊", label: "View Score Report", desc: "See your skill gap analysis", path: "/score", delay: 0.5 },
          ].map((action) => (
            <AnimatedCard
              key={action.label}
              className="bg-navy-100 border-2 border-dashed border-navy-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-navy-200 transition"
              onClick={() => navigate(action.path)}
              delay={action.delay}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-medium text-navy-800">{action.label}</p>
              <p className="text-xs text-navy-400 mt-1">{action.desc}</p>
            </AnimatedCard>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;