// MGVF-U Interactive Explorer
// Single-variable simulator: approachLevel 0 to 10.
// This is a conceptual visual demo, not a numerical black-hole physics engine.

const levels = [
  {d:1,       s:1,  bh:130, blur:0,   scale:1.00, field:.04, log:"Stable orbit. Vacuum stiffness minimal. Ship and Earth clocks remain synchronized."},
  {d:3,       s:2,  bh:155, blur:.1,  scale:1.01, field:.06, log:"Approach begun. Curvature rises gently; vacuum stiffness begins to register."},
  {d:12,      s:3,  bh:185, blur:.2,  scale:1.02, field:.08, log:"Earth clock now advances noticeably faster than ship time."},
  {d:80,      s:4,  bh:225, blur:.35, scale:1.035, field:.12, log:"Starlight is bending. Local vacuum response is strengthening."},
  {d:500,     s:5,  bh:270, blur:.5,  scale:1.05, field:.16, log:"MGVF-U overlay: simulated vacuum stiffness is now medium-high."},
  {d:3200,    s:6,  bh:330, blur:.65, scale:1.07, field:.22, log:"Ship clock is falling far behind the Earth reference clock."},
  {d:18000,   s:7,  bh:405, blur:.85, scale:1.10, field:.28, log:"Warning: strong time dilation. Horizon distance decreasing."},
  {d:95000,   s:8,  bh:500, blur:1.05,scale:1.14, field:.35, log:"Vacuum stiffness approaching extreme simulated values."},
  {d:420000,  s:9,  bh:620, blur:1.25,scale:1.20, field:.44, log:"Earth future is accelerating across the mission clock."},
  {d:1200000, s:10, bh:760, blur:1.55,scale:1.28, field:.52, log:"Near-horizon simulation. Local vacuum response near maximum."},
  {d:3500000, s:10, bh:940, blur:1.9, scale:1.38, field:.62, log:"You have experienced minutes. Earth has moved years ahead. Mission limit reached."}
];

let level = 0;
let shipSeconds = 0;
let overlayOn = true;

const el = id => document.getElementById(id);

function formatShip(seconds){
  const d = Math.floor(seconds / 86400);
  seconds %= 86400;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function formatEarth(seconds){
  const y = Math.floor(seconds / 31557600);
  seconds %= 31557600;
  const d = Math.floor(seconds / 86400);
  seconds %= 86400;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(y).padStart(2,'0')}y ${String(d).padStart(3,'0')}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function update(){
  const x = levels[level];
  const earthSeconds = shipSeconds * x.d;

  el("shipClock").textContent = formatShip(shipSeconds);
  el("earthClock").textContent = formatEarth(earthSeconds);
  el("dilation").textContent = x.d.toLocaleString() + "×";
  el("stiffness").textContent = x.s + " / 10";
  el("levelPill").textContent = `Approach Level ${level} / 10`;
  el("missionLog").innerHTML = level >= 7 ? `<span class="warning">${x.log}</span>` : x.log;

  el("dilationBar").style.width = `${Math.min(100, level * 10)}%`;
  el("stiffnessBar").style.width = `${x.s * 10}%`;

  document.documentElement.style.setProperty("--bhSize", x.bh + "px");
  document.documentElement.style.setProperty("--bhGlow", (20 + level * 9) + "px");
  document.documentElement.style.setProperty("--starBlur", x.blur + "px");
  document.documentElement.style.setProperty("--starScale", x.scale);
  document.documentElement.style.setProperty("--fieldOpacity", x.field);

  document.body.classList.toggle("overlay-off", !overlayOn);
  el("overlayToggle").textContent = `MGVF-U Overlay: ${overlayOn ? "On" : "Off"}`;
}

el("approach").addEventListener("click", () => {
  level = Math.min(level + 1, 10);
  update();
});

el("retreat").addEventListener("click", () => {
  level = Math.max(level - 1, 0);
  update();
});

el("reset").addEventListener("click", () => {
  level = 0;
  shipSeconds = 0;
  update();
});

el("overlayToggle").addEventListener("click", () => {
  overlayOn = !overlayOn;
  update();
});

el("infoButton").addEventListener("click", () => {
  el("scienceModal").classList.remove("hidden");
});

el("closeModal").addEventListener("click", () => {
  el("scienceModal").classList.add("hidden");
});

el("scienceModal").addEventListener("click", event => {
  if(event.target.id === "scienceModal"){
    el("scienceModal").classList.add("hidden");
  }
});

document.addEventListener("keydown", event => {
  if(event.key === "ArrowRight") {
    level = Math.min(level + 1, 10);
    update();
  }
  if(event.key === "ArrowLeft") {
    level = Math.max(level - 1, 0);
    update();
  }
  if(event.key === "Escape") {
    el("scienceModal").classList.add("hidden");
  }
});

setInterval(() => {
  shipSeconds += 1;
  update();
}, 1000);

update();
