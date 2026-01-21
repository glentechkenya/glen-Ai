const chat = document.getElementById("chat");
const input = document.getElementById("input");

/* ===== PARTICLES ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w,h,particles;

function resize(){
  w=canvas.width=window.innerWidth;
  h=canvas.height=window.innerHeight;
}
window.onresize=resize;
resize();

particles = Array.from({length:60},()=>({
  x:Math.random()*w,
  y:Math.random()*h,
  r:Math.random()*2+1,
  v:Math.random()*.4+.1
}));

function animate(){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#00f7ff33";
  particles.forEach(p=>{
    p.y-=p.v;
    if(p.y<0)p.y=h;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();

/* ===== CHAT ===== */
function addMessage(text, sender){
  const div=document.createElement("div");
  div.className="msg "+sender;
  chat.appendChild(div);

  let i=0;
  const stream=setInterval(()=>{
    div.textContent+=text[i++];
    chat.scrollTop=chat.scrollHeight;
    if(i>=text.length){
      clearInterval(stream);
      if(sender==="bot"){
        const c=document.createElement("div");
        c.className="copy";
        c.textContent="Copy";
        c.onclick=()=>navigator.clipboard.writeText(text);
        div.appendChild(c);
      }
    }
  },15);
}

async function sendMessage(){
  const msg=input.value.trim();
  if(!msg) return;
  addMessage(msg,"user");
  input.value="";

  const res=await fetch("/api/chat",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ message:msg })
  });

  const data=await res.json();

  // occasional identity
  let reply=data.reply;
  if(Math.random()<0.25){
    reply="I am GlenAI. "+reply;
  }

  addMessage(reply,"bot");
}

function clearChat(){
  chat.innerHTML="";
}
