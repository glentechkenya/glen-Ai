import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY missing");
}

const memory = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;
  if (!message) return res.json({ reply: "Say something 🙂" });

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
          "Content-Type": "application/json",
          "HTTP-Referer": "https://developersweb-five.vercel.app/",
          "X-Title": "GlenAI by GlenTechKenya"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content:
                "You are GlenAI 🤖✨. Friendly, smart, modern. Use emojis naturally."
            },
            ...memory[userId]
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I’m here 🙂 try asking again.";

    memory[userId].push({ role: "assistant", content: reply });
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Network issue. Try again 🙂" });
  }
});

app.listen(3000, () => {
  console.log("✅ GlenAI running on port 3000");
});
