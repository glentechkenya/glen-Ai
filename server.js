import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "GlenAI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-preview-09-2025",
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: "You are GlenAI, a futuristic AI created by Glen Tech."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({
        error: data.error?.message || "No response from model"
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("OpenRouter Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GlenAI running on port ${PORT}`);
});
