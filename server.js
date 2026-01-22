import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const memory = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  memory[userId] = memory[userId] || [];
  memory[userId].push({ role: "user", content: message });
  memory[userId] = memory[userId].slice(-8);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content:
                "You are GlenAI 🤖✨. Friendly, smart, helpful, modern. Use emojis naturally."
            },
            ...memory[userId]
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Hmm… try again 🙂";

    memory[userId].push({ role: "assistant", content: reply });
    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Connection issue. Try again 🙂" });
  }
});

app.listen(3000, () => console.log("GlenAI live"));
