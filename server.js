import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are GlenAI 🤖✨ — friendly, futuristic, helpful. Reply like ChatGPT and use emojis naturally."
        },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("OPENROUTER ERROR:", err.message);
    res.status(500).json({
      reply: "❌ AI backend error. Model or API key issue."
    });
  }
});

app.listen(3000, () => {
  console.log("✅ GlenAI backend running on port 3000");
});
