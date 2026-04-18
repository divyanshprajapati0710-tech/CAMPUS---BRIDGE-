import dotenv from "dotenv";
dotenv.config();

console.log(
  "Gemini API Key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

export const generateQuestions = async (testType, branch = "AIDS") => {
  try {
    const randomSeed = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();

    let topicsPrompt = "";

    if (testType === "technical") {
      const topicSets = {
        AIDS: [
          "Python decorators, generators, and list comprehensions",
          "Machine Learning algorithms: SVM, Random Forest, KNN",
          "Deep Learning: CNN, RNN, LSTM architectures",
          "Pandas DataFrames: groupby, merge, pivot operations",
          "MongoDB aggregation pipeline and indexing",
          "NumPy array operations and broadcasting",
          "Feature engineering and data preprocessing",
          "Model evaluation: precision, recall, F1, ROC-AUC",
          "Natural Language Processing fundamentals",
          "Data visualization with Matplotlib and Seaborn",
        ],
        CSE: [
          "Binary trees, AVL trees, and graph traversals",
          "Dynamic programming and memoization",
          "Process scheduling: Round Robin, Priority, FCFS",
          "TCP/IP protocol stack and OSI model",
          "SQL joins, subqueries, and transactions",
          "Sorting algorithms and their complexities",
          "Memory management and virtual memory",
          "Design patterns: Singleton, Factory, Observer",
          "Compiler design: lexical analysis, parsing",
          "Deadlock detection and prevention",
        ],
        IT: [
          "React hooks: useState, useEffect, useContext",
          "REST API design and HTTP methods",
          "JWT authentication and OAuth 2.0",
          "SQL normalization and ACID properties",
          "Cybersecurity: XSS, CSRF, SQL Injection",
          "Cloud computing: AWS, Azure fundamentals",
          "Docker containers and microservices",
          "Node.js event loop and async programming",
          "Web performance optimization techniques",
          "Git branching strategies and CI/CD",
        ],
      };

      const topics = topicSets[branch] || topicSets["AIDS"];
      const shuffled = [...topics]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      topicsPrompt = `Technical assessment for ${branch} branch.
Focus on these specific topics this time (Session: ${randomSeed}):
${shuffled.map((t, i) => `${i + 1}. ${t}`).join("\n")}
Generate 2 questions per topic.`;
    } else if (testType === "aptitude") {
      const aptitudeTypes = [
        `Focus on: Time & Work, Speed & Distance, Profit & Loss with NEW numbers (seed: ${randomSeed})`,
        `Focus on: Percentages, Ratios, Averages with DIFFERENT scenarios (seed: ${randomSeed})`,
        `Focus on: Number series, Coding-Decoding, Blood Relations (seed: ${randomSeed})`,
        `Focus on: Syllogisms, Direction sense, Ranking problems (seed: ${randomSeed})`,
        `Focus on: Data interpretation with tables and charts (seed: ${randomSeed})`,
      ];

      topicsPrompt =
        aptitudeTypes[Math.floor(Math.random() * aptitudeTypes.length)];
    } else {
      const softSkillTypes = [
        `Focus on: Workplace conflict resolution and team dynamics scenarios (seed: ${randomSeed})`,
        `Focus on: Leadership styles and decision making under pressure (seed: ${randomSeed})`,
        `Focus on: Professional communication and presentation skills (seed: ${randomSeed})`,
        `Focus on: Time management, prioritization and stress handling (seed: ${randomSeed})`,
        `Focus on: Emotional intelligence and empathy in workplace (seed: ${randomSeed})`,
      ];

      topicsPrompt =
        softSkillTypes[Math.floor(Math.random() * softSkillTypes.length)];
    }

    const fullPrompt = `You are a professional assessment creator. Generate EXACTLY 10 unique MCQ questions.

IMPORTANT RULES:
- Session ID: ${randomSeed} - Timestamp: ${timestamp} - Use these to make questions UNIQUE every time
- NEVER repeat questions from previous sessions
- All questions must be different from standard textbook questions
- Use creative real-world scenarios
- For aptitude: use completely different numbers than typical examples

${topicsPrompt}

Return ONLY a valid JSON array with no markdown formatting, no code blocks, no explanation.
Just the raw JSON array starting with [ and ending with ].

Format:
[
  {
    "id": "q1",
    "topic": "Exact Topic Name",
    "question": "Complete question text ending with ?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "answer": "Exact text of correct option"
  }
]

Critical rules:
- answer field must EXACTLY match one of the 4 options word for word
- Generate all 10 questions numbered q1 to q10
- Make each question genuinely different and challenging
- Do not wrap in markdown code blocks`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 4000,
          },
        }),
      }
    );

    const json = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(json));

    const responseText =
      json.candidates[0].content.parts[0].text.trim();

    console.log("Gemini response received, parsing...");

    // Clean response — remove markdown code blocks if present
    let cleanedResponse = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract JSON array
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const questions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid questions format");
    }

    // Validate and clean each question
    const validated = questions.map((q, i) => ({
      id: `q${i + 1}`,
      topic: q.topic || "General",
      question: q.question || "",
      options:
        Array.isArray(q.options) && q.options.length === 4
          ? q.options
          : ["Option A", "Option B", "Option C", "Option D"],
      answer: q.answer || "",
    }));

    // Verify answers match options
    const verified = validated.map((q) => {
      const answerExists = q.options.some(
        (opt) => opt.trim() === q.answer.trim()
      );

      if (!answerExists) {
        console.warn(`Answer mismatch for ${q.id}, using first option`);
        return { ...q, answer: q.options[0] };
      }

      return q;
    });

    console.log(
      `Successfully generated ${verified.length} unique questions`
    );

    return verified;
  } catch (error) {
    console.error(
      "Gemini question generation failed:",
      error.message
    );
    return null;
  }
};