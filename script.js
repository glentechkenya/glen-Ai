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

  addMessage(message, "user");
  input.value = "";

  addMessage("Thinking...", "bot");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://glenai.local",
        "X-Title": "GlenAI"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // remove "Thinking..."
    chat.removeChild(chat.lastChild);

    const reply = data.choices[0].message.content;
    addMessage(reply, "bot");

  } catch (error) {
    chat.removeChild(chat.lastChild);
    addMessage("Error: " + error.message, "bot");
  }
}
