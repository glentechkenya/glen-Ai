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

  // Show typing indicator
  const typingMsg = document.createElement("div");
  typingMsg.className = "message ai";
  typingMsg.textContent = "AI is typing...";
  chatWindow.appendChild(typingMsg);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Call backend
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });
  const data = await res.json();

  // Replace typing indicator with AI reply
  typingMsg.textContent = data.reply;

  chatWindow.scrollTop = chatWindow.scrollHeight;
}
