async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  const chatWindow = document.getElementById("chat-window");

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chatWindow.appendChild(userMsg);

  input.value = "";

  // Call backend
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });
  const data = await res.json();

  // Show AI reply
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.textContent = data.reply;
  chatWindow.appendChild(aiMsg);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}
