import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    department: "",
    semester: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await registerUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-navy-200 bg-navy-50 rounded-lg px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 placeholder-navy-300";
  const labelClass = "block text-sm font-medium text-navy-700 mb-1";

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8 w-full max-w-md">

        {/* Logo */}
       <div className="text-center mb-8">
  <div className="flex justify-center mb-4">
    <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-16 h-16 rounded-2xl object-cover" />
  </div>
  <h1 className="text-2xl font-bold text-navy-800">Create Account</h1>
  <p className="text-navy-400 text-sm mt-1">Join Campus Bridge today</p>
</div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Yathesh Vengurlekar"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Roll No</label>
              <input
                type="text"
                name="rollNo"
                value={form.rollNo}
                onChange={handleChange}
                placeholder="59"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Semester</label>
              <input
                type="number"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                placeholder="4"
                min="1"
                max="8"
                className={inputClass}
              />
            </div>
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
            <label className={labelClass}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 hover:bg-navy-900 text-white font-medium py-2.5 rounded-lg text-sm transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-navy-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-navy-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-sm text-navy-400 mt-2">
          <Link to="/" className="text-navy-500 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;