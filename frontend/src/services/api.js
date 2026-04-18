import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);

export const getMatchedJobs = () => API.get("/jobs/matches");

export const getScore = () => API.get("/score");

export const getQuestions = (type, branch) =>
  API.get(`/assessment/questions/${type}?branch=${branch}`);
export const submitAssessment = (data) => API.post("/assessment/submit", data);
export const getAssessmentHistory = () => API.get("/assessment/history");

export default API;