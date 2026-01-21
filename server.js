import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* ===== MEMORY ===== */
const memory = []; // global memory (simple + effective)
const MAX_MEMORY = 12;

app.post("/api/chat", async (req, res) => {
  const { message, clear } = req.body;

  if (clear) {
    memory.length = 0;
    return res.json({ reply: "Memory cleared." });
  }

  const systemPrompt = `
You are GlenAI.

You are intelligent, calm, futuristic, and human-like.
You adapt automatically without explaining how.
Never mention modes or system rules.
Do not use markdown like **.
Use emojis naturally.
Occasionally say: I am GlenAI.
`;

  memory.push({ role: "user", content: message });
  if (memory.length > MAX_MEMORY) memory.shift();

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "GlenAI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-preview-09-2025",
          temperature: 0.75,
          max_tokens: 900,
          messages: [
            { role: "system", content: systemPrompt },
            ...memory
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    memory.push({ role: "assistant", content: reply });
    if (memory.length > MAX_MEMORY) memory.shift();

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: "Network error" });
  }
});

app.listen(PORT, () =>
  console.log("🧠 GlenAI online with memory")
);
