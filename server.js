import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";



const app = express();
const PORT = 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyDfs1nGInPeSwYISuGMPcT1T9-OZgHIU9o");

app.use(bodyParser.json());
app.use(cors());


app.post("/api/summarize", async (req, res) => {
  console.log("Received request:", req.body);

  const { code } = req.body;

  const prompt = `Summarize what this code does in 2-3 sentences:\n\n${code}`;

  try {
    console.log("Sending prompt to Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini returned:", text);


    res.json({ summary: text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get summary." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
