import { useToast } from "../components/Toast";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getQuestions, submitAssessment, getProfile } from "../services/api";

const TEST_INFO = {
  technical: {
    label: "Technical Test",
    icon: "💻",
    desc: "DSA, Python, Web Dev, Database — based on your branch",
  },
  aptitude: {
    label: "Aptitude Test",
    icon: "🧠",
    desc: "Quantitative, Logical Reasoning, Verbal, Data Interpretation",
  },
  softskills: {
    label: "Soft Skills Test",
    icon: "🤝",
    desc: "Communication, Leadership, Teamwork, Problem Solving",
  },
};

function Assessment() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("pick");
  const [testType, setTestType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState("AIDS");
  const [timeLeft, setTimeLeft] = useState(600);
  const toast = useToast();

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const { data } = await getProfile();
        if (data.department) setBranch(data.department);
      } catch (err) {
        // Error handled silently as per original logic
      }
    };
    fetchBranch();
  }, []);

  useEffect(() => {
    if (stage !== "test") return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, stage]);

  const startTest = async (type) => {
    setLoading(true);
    setTestType(type);
    try {
      const { data } = await getQuestions(type, branch);
      setQuestions(data);
      setAnswers({});
      setCurrent(0);
      setTimeLeft(600);
      setStage("test");
    } catch (err) {
      toast("Failed to load questions. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await submitAssessment({
        testType,
        branch,
        userAnswers: answers,
      });
      setResult(data);
      setStage("result");
      toast("Test submitted successfully!", "success");
    } catch (err) {
      toast("Failed to submit assessment. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-700";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const Navbar = () => (
    <nav className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo.png"
          alt="Campus Bridge"
          className="w-9 h-9 rounded-xl object-cover"
        />
        <span className="font-bold text-navy-800 text-lg">Campus Bridge</span>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">
          Dashboard
        </Link>
        <Link to="/profile" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">
          Profile
        </Link>
        <Link to="/jobs" className="text-sm text-navy-500 hover:text-navy-800 font-medium transition">
          Jobs
        </Link>
      </div>
    </nav>
  );

  // Stage 1 — Pick Test
  if (stage === "pick") {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy-800">Assessment Center 🎯</h2>
            <p className="text-navy-400 text-sm mt-1">
              Choose a test to evaluate your skills. Each test has 10 questions and 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(TEST_INFO).map(([type, info]) => (
              <div
                key={type}
                className="bg-navy-100 rounded-2xl p-6 hover:bg-navy-200 transition cursor-pointer border-2 border-transparent hover:border-navy-300"
                onClick={() => !loading && startTest(type)}
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">{info.label}</h3>
                <p className="text-sm text-navy-500 mb-4">{info.desc}</p>
                <div className="flex items-center gap-2 text-xs text-navy-400 mb-4">
                  <span>⏱ 10 minutes</span>
                  <span>·</span>
                  <span>10 questions</span>
                </div>
                <button
                  className="w-full bg-navy-800 hover:bg-navy-900 text-white text-sm font-medium py-2 rounded-lg transition"
                  disabled={loading}
                >
                  {loading ? "Loading questions..." : "Start Test →"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/assessment/history")}
              className="text-sm bg-navy-100 border border-navy-200 hover:bg-navy-200 text-navy-700 font-medium px-6 py-2.5 rounded-xl transition"
            >
              View Past Assessment History →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage 2 — Take Test
  if (stage === "test") {
    const q = questions[current];
    const progress = Math.round(((current + 1) / questions.length) * 100);

    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-navy-800">{TEST_INFO[testType]?.label}</h2>
              <p className="text-xs text-navy-400">Question {current + 1} of {questions.length}</p>
            </div>
            <div className={`text-lg font-bold px-4 py-2 rounded-xl ${
              timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-navy-100 text-navy-700"
            }`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-navy-200 rounded-full h-2 mb-8">
            <div
              className="bg-navy-800 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-navy-100 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-navy-800 text-white px-3 py-1 rounded-full font-medium">
                {q.topic}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-6">{q.question}</h3>
            <div className="space-y-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(q.id, option)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm transition ${
                    answers[q.id] === option
                      ? "border-navy-800 bg-navy-800 text-white font-medium"
                      : "border-navy-200 bg-white hover:border-navy-400 text-navy-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-6 py-2.5 rounded-xl border border-navy-200 bg-white text-sm text-navy-600 hover:bg-navy-100 disabled:opacity-40 transition"
            >
              ← Previous
            </button>

            <div className="flex gap-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded-full text-xs font-medium transition ${
                    i === current
                      ? "bg-navy-800 text-white"
                      : answers[questions[i]?.id]
                      ? "bg-navy-300 text-navy-800"
                      : "bg-navy-100 text-navy-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="px-6 py-2.5 rounded-xl bg-navy-800 text-white text-sm hover:bg-navy-900 transition"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Test ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Stage 3 — Results
  if (stage === "result" && result) {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-8 py-10">
          {/* Score Banner */}
          <div className="bg-navy-800 rounded-2xl p-8 text-center mb-8">
            <p className="text-navy-300 text-sm mb-2">Your Score</p>
            <div className="text-7xl font-bold mb-2 text-white">
              {result.score}%
            </div>
            <p className="text-navy-300 text-sm mb-4">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </p>
            <div className="max-w-sm mx-auto bg-navy-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  result.score >= 75 ? "bg-green-400" :
                  result.score >= 40 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>

          {/* Comparison */}
          {result.comparison && (
            <div className={`rounded-2xl p-6 mb-8 ${
              result.comparison.improved
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <h3 className="font-semibold text-navy-800 mb-3">
                {result.comparison.improved ? "📈 You Improved!" : "📉 Keep Practicing!"}
              </h3>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-navy-400">Previous Score</p>
                  <p className="text-2xl font-bold text-navy-600">{result.comparison.previousScore}%</p>
                </div>
                <div className="text-2xl text-navy-400">→</div>
                <div>
                  <p className="text-xs text-navy-400">Current Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(result.comparison.currentScore)}`}>
                    {result.comparison.currentScore}%
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  result.comparison.improved ? "text-green-600" : "text-red-500"
                }`}>
                  {result.comparison.improved ? "+" : ""}{result.comparison.difference}%
                </div>
              </div>
              {result.comparison.newlyStrong.length > 0 && (
                <p className="text-sm text-green-700 mt-3">
                  ✅ Improved in: {result.comparison.newlyStrong.join(", ")}
                </p>
              )}
              {result.comparison.stillWeak.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠ Still needs work: {result.comparison.stillWeak.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Strong & Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {result.strongAreas.length > 0 && (
              <div className="bg-navy-100 rounded-2xl p-6">
                <h3 className="font-semibold text-navy-800 mb-3">✅ Strong Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {result.strongAreas.map((area) => (
                    <span
                      key={area}
                      className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.weakAreas.length > 0 && (
              <div className="bg-navy-100 rounded-2xl p-6">
                <h3 className="font-semibold text-navy-800 mb-3">⚠ Weak Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {result.weakAreas.map((area) => (
                    <span
                      key={area}
                      className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Roadmap with YouTube Videos */}
          {result.roadmapData && result.roadmapData.length > 0 && (
            <div className="space-y-6 mb-8">
              {result.roadmapData.map((item, idx) => (
                <div key={idx} className="bg-navy-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-navy-800 mb-4">
                    🗺 Roadmap for:{" "}
                    <span className="text-navy-600">{item.topic}</span>
                  </h3>

                  {/* Steps */}
                  <div className="space-y-3 mb-6">
                    {item.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-navy-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-navy-700">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* YouTube Videos */}
                  {item.videos && item.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-navy-700 mb-3">
                        📺 Recommended YouTube Videos
                      </h4>
                      <div className="space-y-2">
                        {item.videos.map((video, i) => (
                          <a
                            key={i}
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 bg-white border border-navy-200 rounded-xl px-4 py-3 hover:bg-navy-200 hover:border-navy-300 transition group"
                          >
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">▶</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-navy-800 truncate group-hover:text-navy-900">
                                {video.title}
                              </p>
                              <p className="text-xs text-navy-400">{video.channel}</p>
                            </div>
                            <span className="text-xs text-navy-400 group-hover:text-navy-600">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Answer Review */}
          <div className="bg-navy-100 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-navy-800 mb-4">📋 Answer Review</h3>
            <div className="space-y-3">
              {result.answers.map((ans, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${
                    ans.isCorrect
                      ? "bg-green-50 border border-green-100"
                      : "bg-red-50 border border-red-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      ans.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {ans.isCorrect ? "✓ Correct" : "✗ Wrong"}
                    </span>
                    <span className="text-xs text-navy-400">{ans.topic}</span>
                  </div>
                  {!ans.isCorrect && (
                    <div className="text-xs text-navy-600 mt-1">
                      <span className="text-red-500">Your answer: </span>
                      {ans.selected || "Not answered"} ·{" "}
                      <span className="text-green-600">Correct: </span>
                      {ans.correct}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setStage("pick")}
              className="bg-navy-800 hover:bg-navy-900 text-white font-medium py-3 rounded-xl text-sm transition"
            >
              Take Another Test
            </button>
            <button
              onClick={() => navigate("/assessment/history")}
              className="bg-navy-100 border border-navy-200 hover:bg-navy-200 text-navy-700 font-medium py-3 rounded-xl text-sm transition"
            >
              View History
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-navy-100 border border-navy-200 hover:bg-navy-200 text-navy-700 font-medium py-3 rounded-xl text-sm transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Assessment;