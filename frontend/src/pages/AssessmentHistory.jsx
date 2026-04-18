import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAssessmentHistory } from "../services/api";

function AssessmentHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getAssessmentHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = filter === "all"
    ? history
    : history.filter((h) => h.testType === filter);

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-700";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-100";
    if (score >= 40) return "bg-amber-100";
    return "bg-red-100";
  };

  const getTypeIcon = (type) => {
    if (type === "technical") return "💻";
    if (type === "aptitude") return "🧠";
    return "🤝";
  };

  const getTypeLabel = (type) => {
    if (type === "technical") return "Technical";
    if (type === "aptitude") return "Aptitude";
    return "Soft Skills";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTrend = (type) => {
    return history
      .filter((h) => h.testType === type)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

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
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-800">Assessment History 📈</h2>
            <p className="text-navy-400 text-sm mt-1">Track your progress over time.</p>
          </div>
          <button
            onClick={() => navigate("/assessment")}
            className="bg-navy-800 hover:bg-navy-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
          >
            Take New Test →
          </button>
        </div>

        {/* Trend Summary */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {["technical", "aptitude", "softskills"].map((type) => {
              const tests = getTrend(type);
              if (tests.length === 0) return null;
              const latest = tests[tests.length - 1].score;
              const first = tests[0].score;
              const improved = latest - first;
              return (
                <div key={type} className="bg-navy-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{getTypeIcon(type)}</span>
                    <span className="font-medium text-navy-700">{getTypeLabel(type)}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${getScoreColor(latest)}`}>{latest}%</span>
                    <span className="text-xs text-navy-400 mb-1">latest</span>
                  </div>
                  <div className="text-xs mt-1">
                    {tests.length > 1 ? (
                      <span className={improved >= 0 ? "text-green-600" : "text-red-500"}>
                        {improved >= 0 ? "↑" : "↓"} {Math.abs(improved)}% from first attempt
                      </span>
                    ) : (
                      <span className="text-navy-400">{tests.length} attempt</span>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mt-3 h-8">
                    {tests.map((t, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-navy-400"
                        style={{ height: `${t.score}%`, maxHeight: "100%" }}
                        title={`${t.score}%`}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "technical", "aptitude", "softskills"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                filter === f
                  ? "bg-navy-800 text-white"
                  : "bg-white text-navy-600 border border-navy-200 hover:bg-navy-100"
              }`}
            >
              {f === "all" ? "All Tests" : getTypeLabel(f)}
            </button>
          ))}
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-20 text-navy-400">Loading history...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-navy-400 mb-4">No assessments found.</p>
            <button
              onClick={() => navigate("/assessment")}
              className="bg-navy-800 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-navy-900 transition"
            >
              Take Your First Test →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, index) => (
              <div key={item._id} className="bg-navy-100 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getTypeIcon(item.testType)}</span>
                      <span className="font-semibold text-navy-800">{getTypeLabel(item.testType)} Test</span>
                      <span className="text-xs text-navy-400">#{filtered.length - index}</span>
                    </div>
                    <p className="text-xs text-navy-400 mb-3">{formatDate(item.createdAt)}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="text-xs text-navy-400">Correct</p>
                        <p className="text-sm font-medium text-navy-700">
                          {item.correctAnswers}/{item.totalQuestions}
                        </p>
                      </div>
                      {item.strongAreas?.length > 0 && (
                        <div>
                          <p className="text-xs text-navy-400">Strong</p>
                          <p className="text-sm font-medium text-green-600">
                            {item.strongAreas.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                    {item.weakAreas?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-navy-400 mr-1">Weak:</span>
                        {item.weakAreas.map((area) => (
                          <span key={area} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`text-center px-4 py-3 rounded-xl ${getScoreBg(item.score)}`}>
                    <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </div>
                    <p className="text-xs text-navy-400 mt-1">score</p>
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

export default AssessmentHistory;