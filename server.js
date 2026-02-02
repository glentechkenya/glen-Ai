import express from "express";
import axios from "axios";

const app = express();
app.use(express.static("public"));
app.use(express.json());

// OpenRouter chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4", // you can swap to another model available on OpenRouter
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("OpenRouter API error:", err.message);
    res.status(500).json({ reply: "❌ Error contacting OpenRouter API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Glentech AI running on port ${PORT}`));
