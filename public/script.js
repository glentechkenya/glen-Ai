const chat = document.getElementById("chat");
const input = document.getElementById("input");

let history = JSON.parse(localStorage.getItem("glenai")) || [];

history.forEach(m => addMessage(m.text, m.sender));

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;
  div.textContent = text.replace(/\*\*/g,"");
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  history.push({ text, sender });
  localStorage.setItem("glenai", JSON.stringify(history));
}

function typingDots() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.textContent = "typing";
  chat.appendChild(div);

  let dots = 0;
  const interval = setInterval(() => {
    div.textContent = "typing" + ".".repeat(dots++ % 4);
  }, 400);

  return () => {
    clearInterval(interval);
    chat.removeChild(div);
  };
}

async function streamText(text) {
  const div = document.createElement("div");
  div.className = "msg bot";
  chat.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text[i++];
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 18);
}

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  addMessage(msg, "user");
  input.value = "";

  const stopTyping = typingDots();

  const res = await fetch("/api/chat", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ message: msg })
  });

  const data = await res.json();
  stopTyping();
  streamText(data.reply);
}
