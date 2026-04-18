import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
  <div className="flex justify-center mb-4">
    <img src="/src/assets/logo.png" alt="Campus Bridge" className="w-16 h-16 rounded-2xl object-cover" />
  </div>
  <h1 className="text-2xl font-bold text-navy-800">Campus Bridge</h1>
  <p className="text-navy-400 text-sm mt-1">Sign in to your account</p>
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
            <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-navy-200 bg-navy-50 rounded-lg px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 placeholder-navy-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-navy-200 bg-navy-50 rounded-lg px-4 py-2.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 placeholder-navy-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 hover:bg-navy-900 text-white font-medium py-2.5 rounded-lg text-sm transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-navy-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-navy-600 font-medium hover:underline">
            Register here
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

export default Login;