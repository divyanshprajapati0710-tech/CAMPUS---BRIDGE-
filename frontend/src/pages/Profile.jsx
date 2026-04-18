import { useToast } from "../components/Toast";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";

const SKILLS_LIST = [
  "Python",
  "JavaScript",
  "React.js",
  "Node.js",
  "MongoDB",
  "SQL",
  "Machine Learning",
  "Deep Learning",
  "Data Analysis",
  "Java",
  "C++",
  "HTML/CSS",
  "Git",
  "Docker",
  "AWS",
  "Communication",
  "Problem Solving",
  "Team Work",
  "Leadership",
];

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    department: "",
    semester: "",
    rollNo: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setForm({
          name: data.name || "",
          department: data.department || "",
          semester: data.semester || "",
          rollNo: data.rollNo || "",
          skills: data.skills || [],
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    if (form.skills.includes(skill)) {
      setForm({
        ...form,
        skills: form.skills.filter((s) => s !== skill),
      });
    } else {
      setForm({
        ...form,
        skills: [...form.skills, skill],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const { data } = await updateProfile(form);
      localStorage.setItem("user", JSON.stringify(data));
      toast("Profile updated successfully!", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-navy-200 bg-navy-50 rounded-lg px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400";
  const labelClass =
    "block text-sm font-medium text-navy-700 mb-1";

  if (fetching)
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <p className="text-navy-500">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-navy-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/logo.png"
            alt="Campus Bridge"
            className="w-9 h-9 rounded-xl object-cover"
          />
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
            to="/jobs"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Jobs
          </Link>

          <Link
            to="/score"
            className="text-sm text-navy-500 hover:text-navy-800 font-medium transition"
          >
            Score
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

      <div className="max-w-3xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-bold text-navy-800 mb-1">
          My Profile
        </h2>
        <p className="text-navy-400 text-sm mb-8">
          Keep your profile updated to get accurate job matches and scores.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-navy-100 rounded-2xl p-6">
            <h3 className="font-semibold text-navy-800 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Roll No</label>
                <input
                  type="text"
                  name="rollNo"
                  value={form.rollNo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  <option value="AIDS">AI & Data Science</option>
                  <option value="CSE">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ENTC">Electronics & Telecom</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Semester</label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-navy-100 rounded-2xl p-6">
            <h3 className="font-semibold text-navy-800 mb-1">
              Skills
            </h3>
            <p className="text-xs text-navy-400 mb-4">
              Select all skills you have. This directly affects your employability score.
            </p>

            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    form.skills.includes(skill)
                      ? "bg-navy-800 text-white"
                      : "bg-white text-navy-600 hover:bg-navy-200 border border-navy-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {form.skills.length > 0 && (
              <p className="text-xs text-navy-500 mt-3">
                {form.skills.length} skill(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 hover:bg-navy-900 text-white font-medium py-3 rounded-xl text-sm transition duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;