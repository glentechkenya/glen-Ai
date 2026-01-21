import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let adminMemory = [];

app.post("/api/chat", async (req, res) => {
  const { message, admin } = req.body;

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a smart, friendly futuristic AI. Speak naturally. Use emojis sometimes. Reply in the same language as the user. Do not repeat your name unless asked."
      }
    ];

    if (admin && adminMemory.length) {
      messages.push(...adminMemory);
    }

    messages.push({ role: "user", content: message });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "GlenAI"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-preview-09-2025",
        max_tokens: 800,
        temperature: 0.8,
        messages
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    if (admin) {
      adminMemory.push({ role: "user", content: message });
      adminMemory.push({ role: "assistant", content: reply });
    }

    res.json({ reply });
  } catch {
    res.status(500).json({ error: "Network error" });
  }
});

app.post("/api/admin-login", (req, res) => {
  if (req.body.key === process.env.ADMIN_KEY) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

app.listen(PORT, () => console.log("🚀 GlenAI online"));
