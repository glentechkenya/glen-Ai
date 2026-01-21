export const config = {
  runtime: "nodejs18.x"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

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

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
