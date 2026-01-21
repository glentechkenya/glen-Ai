import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const completion = await openrouter.chat.send({
      model: "google/gemini-2.5-flash-preview-09-2025",
      messages: [
        {
          role: "system",
          content: "You are GlenAI, a futuristic AI created by Glen Tech."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message
            }
          ]
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "No response from Gemini model"
      });
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
