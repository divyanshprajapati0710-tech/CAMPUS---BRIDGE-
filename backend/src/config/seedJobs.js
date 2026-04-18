import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";

dotenv.config();

const jobs = [
  {
    title: "Python Developer Intern",
    company: "TechSoft India",
    location: "Mumbai, India",
    type: "Internship",
    description: "Work on Python-based backend systems and data pipelines.",
    requiredSkills: ["Python", "SQL", "Git"],
    salary: "₹15,000/month",
    applyLink: "https://example.com",
  },
  {
    title: "React.js Frontend Developer",
    company: "WebWorks Pvt Ltd",
    location: "Pune, India",
    type: "Full-time",
    description: "Build modern web applications using React.js and Tailwind CSS.",
    requiredSkills: ["React.js", "JavaScript", "HTML/CSS", "Git"],
    salary: "₹4-6 LPA",
    applyLink: "https://example.com",
  },
  {
    title: "Data Analyst",
    company: "Analytics Hub",
    location: "Bangalore, India",
    type: "Full-time",
    description: "Analyze large datasets and create reports for business decisions.",
    requiredSkills: ["Python", "Data Analysis", "SQL", "Problem Solving"],
    salary: "₹5-8 LPA",
    applyLink: "https://example.com",
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Ventures",
    location: "Remote",
    type: "Remote",
    description: "Build and deploy ML models for real-world applications.",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "Data Analysis"],
    salary: "₹8-12 LPA",
    applyLink: "https://example.com",
  },
  {
    title: "Full Stack Developer",
    company: "StartupX",
    location: "Navi Mumbai, India",
    type: "Full-time",
    description: "Build full stack web applications using MERN stack.",
    requiredSkills: ["React.js", "Node.js", "MongoDB", "JavaScript", "Git"],
    salary: "₹6-10 LPA",
    applyLink: "https://example.com",
  },
  {
    title: "Backend Developer Intern",
    company: "CloudBase Technologies",
    location: "Hyderabad, India",
    type: "Internship",
    description: "Develop REST APIs and work with cloud infrastructure.",
    requiredSkills: ["Node.js", "MongoDB", "AWS", "Git"],
    salary: "₹12,000/month",
    applyLink: "https://example.com",
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Job.deleteMany({});
    console.log("Old jobs cleared");

    await Job.insertMany(jobs);
    console.log("Sample jobs seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedJobs();
