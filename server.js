import express from "express";
import { OpenRouter } from "@openrouter/sdk";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://developersweb-five.vercel.app/",
    "X-Title": "GlenAI by GlenTechKenya"
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Say something 🙂" });
  }

  try {
    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-09-2025",
      messages: [
        {
          role: "system",
          content:
            "You are GlenAI 🤖✨ — friendly, modern, helpful. Use emojis naturally. Respond clearly like ChatGPT."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "No response from model.";

    res.json({ reply });

  } catch (err) {
    console.error("OpenRouter SDK error:", err);
    res.json({
      reply: "AI backend error. Check OpenRouter key or model access."
    });
  }
});

app.listen(3000, () => {
  console.log("✅ GlenAI running on port 3000");
});
