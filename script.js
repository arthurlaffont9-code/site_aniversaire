const screens = document.querySelectorAll(".screen");
const hearts = document.getElementById("hearts");
const petals = document.getElementById("petals");
const lipCursor = document.getElementById("lipCursor");
const pageIds = new Set(Array.from(screens, screen => screen.id));
let giftRevealed = false;

function parsePhotoDescriptions(text) {
  const entries = [];
  const lines = text.split(/\r?\n/).map(line => line.trim());
  let currentEntry = null;

  for (const line of lines) {
    if (!line) {
      continue;
    }

    if (/^descriptions des photos$/i.test(line)) {
      continue;
    }

    const headerMatch = line.match(/^photo\s*\d+\s*-\s*(.+)$/i);
    if (headerMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = {
        title: headerMatch[1].trim(),
        description: "",
      };
      continue;
    }

    if (currentEntry) {
      currentEntry.description = currentEntry.description
        ? `${currentEntry.description} ${line}`
        : line;
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries;
}

async function loadPhotoDescriptions() {
  try {
    const response = await fetch("descriptions_photos.txt", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Impossible de charger descriptions_photos.txt (${response.status})`);
    }

    const text = await response.text();
    const entries = parsePhotoDescriptions(text);
    const cards = document.querySelectorAll(".gallery .photo-card");

    cards.forEach((card, index) => {
      const entry = entries[index];
      if (!entry) {
        return;
      }

      const title = card.querySelector("h3");
      const description = card.querySelector("p");

      if (title) {
        title.textContent = entry.title;
      }

      if (description) {
        description.textContent = entry.description;
      }
    });
  } catch (error) {
    console.warn("Les descriptions des photos n'ont pas pu être chargées automatiquement.", error);
  }
}

function applyPhotoDescriptions(entries) {
  const cards = document.querySelectorAll(".gallery .photo-card");

  cards.forEach((card, index) => {
    const entry = entries[index];
    if (!entry) {
      return;
    }

    const title = card.querySelector("h3");
    const description = card.querySelector("p");

    if (title) {
      title.textContent = entry.title;
    }

    if (description) {
      description.textContent = entry.description;
    }
  });
}

function show(id, updateHash = true){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  if (updateHash && pageIds.has(id)) {
    const hash = `#${id}`;
    if (location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
  }
  window.scrollTo({top:0,behavior:"smooth"});
  if (id === "surprise") {
    revealGift(true);
  }
}
document.querySelectorAll(".nav").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (pageIds.has(target)) {
      location.hash = target;
      return;
    }
    show(target);
  });
});

function showFromHash(){
  const target = location.hash.replace("#", "");
  show(pageIds.has(target) ? target : "question", false);
}
window.addEventListener("hashchange", showFromHash);
showFromHash();
loadPhotoDescriptions();

const noBtn = document.getElementById("noBtn");
const noText = document.getElementById("noText");
let noClicks = 0;
const jokes = [
  "Mauvaise réponse 😭",
  "T'es sûre de toi là ? 👀",
  "Le bouton commence à avoir peur…",
  "Capucine, réfléchis bien 😂❤️",
  "Bon… je crois que tu vas devoir dire oui."
];
noBtn.addEventListener("click", () => {
  noClicks++;
  noText.textContent = jokes[Math.min(noClicks-1, jokes.length-1)];
  noBtn.style.transform = `translate(${Math.sin(noClicks*2)*35}px, ${Math.cos(noClicks)*12}px)`;
  if(noClicks >= 5){
    noBtn.textContent = "Oui finalement 😭❤️";
    noBtn.classList.remove("secondary");
    noBtn.classList.add("primary");
    noBtn.onclick = () => show("welcome");
  }
});
document.getElementById("yesBtn").addEventListener("click", () => {
  burst();
  setTimeout(()=>show("welcome"),250);
});

function makeDecorativeHeart(){
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = ["♥","♡","❤","❥","❣"][Math.floor(Math.random()*5)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (10 + Math.random() * 24) + "px";
  heart.style.animationDuration = (4 + Math.random() * 7) + "s";
  heart.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);
  hearts.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

for(let i = 0; i < 18; i++){
  setTimeout(makeDecorativeHeart, i * 180);
}
setInterval(makeDecorativeHeart, 420);

function makePetal(){
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = ["🌸", "🌷", "✿", "❀"][Math.floor(Math.random()*4)];
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.fontSize = (14 + Math.random() * 20) + "px";
  petal.style.animationDuration = (7 + Math.random() * 5) + "s";
  petal.style.setProperty("--end-rotate", (180 + Math.random() * 540).toFixed(0) + "deg");
  petal.style.animationName = "petalFall";
  petal.style.animationTimingFunction = "linear";
  petals.appendChild(petal);
  setTimeout(() => petal.remove(), 13000);
}

for(let i = 0; i < 22; i++){
  setTimeout(makePetal, i * 120);
}
setInterval(makePetal, 1200);

function makeHeart(){
  const h=document.createElement("span");
  h.className="heart";
  h.textContent=["♥","♡","✦","❤"][Math.floor(Math.random()*4)];
  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=(12+Math.random()*25)+"px";
  h.style.animationDuration=(5+Math.random()*6)+"s";
  hearts.appendChild(h);
  setTimeout(()=>h.remove(),11000);
}
setInterval(makeHeart,420);

function burst(){
  for(let i=0;i<28;i++){
    setTimeout(()=>{
      const h=document.createElement("span");
      h.className="heart";
      h.textContent="♥";
      h.style.left=(40+Math.random()*20)+"vw";
      h.style.bottom=(40+Math.random()*15)+"vh";
      h.style.fontSize=(16+Math.random()*25)+"px";
      h.style.animationDuration=(1.5+Math.random()*2)+"s";
      hearts.appendChild(h);
      setTimeout(()=>h.remove(),4000);
    },i*25);
  }
}

function revealGift(fromAutoOpen = false){
  if (giftRevealed && fromAutoOpen) {
    return;
  }
  giftRevealed = true;
  document.getElementById("gift").textContent = "💝";
  document.getElementById("giftText").textContent = "Tu as maintenant un choix libre de ce que tu veux faire. Garde-le tant que tu ne l'as pas utilisé, c'est à toi. Joyeux anniversaire ma princesse ❤️";
  document.getElementById("openGift").textContent = "C'est à toi ❤️";
  burst();
}

document.getElementById("openGift").addEventListener("click",()=>{
  revealGift(false);
});

window.addEventListener("mousemove", (event) => {
  if (!lipCursor || window.matchMedia("(max-width: 650px)").matches) {
    return;
  }
  document.body.classList.add("has-lip-cursor");
  lipCursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%) scale(1)`;
  lipCursor.style.opacity = "1";
});

window.addEventListener("mouseleave", () => {
  if (lipCursor) {
    lipCursor.style.opacity = "0";
  }
});
