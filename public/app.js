const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const input = document.getElementById("text");
const menu = document.getElementById("menu");

const userId = localStorage.getItem("gid") || crypto.randomUUID();
localStorage.setItem("gid", userId);

function toggleMenu() {
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  messages.appendChild(div);

  if (type === "ai") {
    let i = 0;
    const t = setInterval(() => {
      div.textContent += text[i++];
      messages.scrollTop = messages.scrollHeight;
      if (i >= text.length) clearInterval(t);
    }, 18);
  } else {
    div.textContent = text;
  }
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  typing.style.display = "block";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, userId })
  });

  const data = await res.json();
  typing.style.display = "none";
  addMessage(data.reply, "ai");
}

/* particles */
const c = document.getElementById("particles");
const x = c.getContext("2d");
c.width = innerWidth; c.height = innerHeight;

let p = Array.from({length: 40}, () => ({
  x: Math.random()*c.width,
  y: Math.random()*c.height,
  d: Math.random()*0.4
}));

(function loop(){
  x.clearRect(0,0,c.width,c.height);
  p.forEach(o=>{
    x.fillStyle="#3b82f633";
    x.beginPath();
    x.arc(o.x,o.y,2,0,Math.PI*2);
    x.fill();
    o.y+=o.d;
    if(o.y>c.height)o.y=0;
  });
  requestAnimationFrame(loop);
})();
