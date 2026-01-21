const chat = document.getElementById("chat");
const input = document.getElementById("input");

function renderMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;

  // Detect code blocks ``` ```
  if (text.includes("```")) {
    const parts = text.split("```");
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = part.trim();
        pre.appendChild(code);
        div.appendChild(pre);
      } else {
        const span = document.createElement("div");
        span.textContent = part;
        div.appendChild(span);
      }
    });
  } else {
    div.textContent = text;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  renderMessage(message, "user");
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "msg bot";
  thinking.textContent = "▍ GlenAI thinking…";
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    chat.removeChild(thinking);

    if (data.error) {
      renderMessage("Error: " + data.error, "bot");
      return;
    }

    renderMessage(data.reply, "bot");
  } catch (err) {
    chat.removeChild(thinking);
    renderMessage("Network error", "bot");
  }
}
