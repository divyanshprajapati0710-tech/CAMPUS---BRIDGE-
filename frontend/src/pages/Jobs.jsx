import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const types = ["All", "Full-time", "Internship", "Remote", "Part-time"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs/matches");
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered =
    filter === "All" ? jobs : jobs.filter((j) => j.type === filter);

  const getMatchColor = (percent) => {
    if (percent >= 75) return "text-green-700 bg-green-100";
    if (percent >= 40) return "text-amber-700 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const getTypeBadge = (type) => {
    const colors = {
      "Full-time": "bg-navy-200 text-navy-700",
      Internship: "bg-navy-100 text-navy-600",
      Remote: "bg-navy-200 text-navy-700",
      "Part-time": "bg-navy-100 text-navy-600",
    };
    return colors[type] || "bg-navy-100 text-navy-600";
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-navy-800 text-lg">
            Campus Bridge
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Dashboard
          </Link>

          <Link
            to="/assessment"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Assessment
          </Link>

          <Link
            to="/score"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Score
          </Link>

          <Link
            to="/profile"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="text-sm bg-navy-100 text-navy-700 px-4 py-1.5 rounded-lg hover:bg-navy-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-800">
            Job Matches 💼
          </h2>
          <p className="text-navy-400 text-sm mt-1">
            Jobs ranked by how well they match your skills.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === type
                  ? "bg-navy-800 text-white"
                  : "bg-white text-navy-600 border border-navy-200 hover:bg-navy-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-20 text-navy-400">
            Loading jobs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-navy-400">
            No jobs found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <div
                key={job._id}
                className="bg-navy-100 rounded-2xl p-6 hover:bg-navy-200 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-navy-800 text-lg">
                        {job.title}
                      </h3>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeBadge(
                          job.type
                        )}`}
                      >
                        {job.type}
                      </span>
                    </div>

                    <p className="text-sm text-navy-500 mb-1">
                      {job.company} · {job.location}
                    </p>

                    <p className="text-sm text-navy-600 mb-3">
                      {job.description}
                    </p>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            job.matchedSkills?.includes(skill)
                              ? "bg-green-100 text-green-700"
                              : "bg-white text-navy-500 border border-navy-200"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm font-medium text-navy-700">
                      💰 {job.salary}
                    </p>
                  </div>

                  {/* Match Score */}
                  <div className="text-center min-w-[80px]">
                    <div
                      className={`text-2xl font-bold px-3 py-2 rounded-xl ${getMatchColor(
                        job.matchPercent
                      )}`}
                    >
                      {job.matchPercent}%
                    </div>

                    <p className="text-xs text-navy-400 mt-1">match</p>

                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-xs bg-navy-800 text-white px-3 py-1.5 rounded-lg hover:bg-navy-900 transition"
                    >
                      Apply
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;