import dotenv from "dotenv";
dotenv.config();

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
);
const data = await response.json();
data.models.forEach(m => console.log(m.name, "-", m.supportedGenerationMethods));
