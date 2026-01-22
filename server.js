import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* =========================
   🧠 SAFE PERSISTENT MEMORY
========================= */
const MEMORY_FILE = "./memory.json";
let memory = {};

if (fs.existsSync(MEMORY_FILE)) {
  memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
}

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

/* =========================
   🔥 SYSTEM PROMPT
========================= */
const SYSTEM_PROMPT = `
You are GlenAI.
BMW M-series energy. Dark neon hacker. Gifted mind.
Calm. Precise. Dominant intelligence.
Short, powerful responses.
`;

/* =========================
   🩺 HEALTH
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* =========================
   🤖 CHAT ENDPOINT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (!memory[userId]) memory[userId] = [];
    memory[userId].push({ role: "user", content: message });

    // keep memory LIGHT (last 6 messages)
    memory[userId] = memory[userId].slice(-6);
    saveMemory();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...memory[userId]
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    memory[userId].push({ role: "assistant", content: reply });
    memory[userId] = memory[userId].slice(-6);
    saveMemory();

    res.json({ reply });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "GlenAI error" });
  }
});

/* =========================
   🚀 START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🖤 GlenAI online on port", PORT);
});
