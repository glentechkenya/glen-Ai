const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // User message
  addMessage(message, "user");
  input.value = "";

  // Thinking message
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "msg bot";
  thinkingDiv.innerText = "Thinking...";
  chat.appendChild(thinkingDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "GlenAI"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are GlenAI, a helpful futuristic AI created by Glen Tech."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // Remove thinking
    chat.removeChild(thinkingDiv);

    // Safe handling
    if (!data.choices || !data.choices.length) {
      addMessage(
        "API Error: " + (data.error?.message || "No response from model"),
        "bot"
      );
      console.log("OpenRouter response:", data);
      return;
    }

    const reply = data.choices[0].message.content;
    addMessage(reply, "bot");

  } catch (error) {
    chat.removeChild(thinkingDiv);
    addMessage("Network Error: " + error.message, "bot");
  }
}
