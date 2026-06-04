import { Journey } from "./journey.js";
import { Fish } from "./fish-particles.js";
import { AudioBed } from "./audio.js";
import { BoardingPass } from "./boarding-pass.js";
import { DecadeWeather } from "./decade-weather.js";
import { renderShop } from "./shop.js";
import { initializeShopifyBuyButtons } from "./shopify-buy-buttons.js";
import { scenes } from "./data/scenes.js";
import { products } from "./shop-data.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Build the scroll track: one viewport-tall panel per scene. ---
const track = document.getElementById("scroll-track");
scenes.forEach((s, i) => {
  const panel = document.createElement("section");
  panel.className = "scene-panel";
  panel.dataset.index = String(i);
  panel.setAttribute("aria-label", s.title);
  track.appendChild(panel);
});

// --- WebGL journey + fish overlay. ---
const smallScreen =
  window.matchMedia("(max-width: 768px)").matches ||
  window.matchMedia("(hover: none)").matches;
const journey = new Journey(document.getElementById("gl"), { reducedMotion });
const fish = new Fish(journey.scene, { reducedMotion, count: smallScreen ? 18 : 36 });

// --- Audio bed. ---
const audio = new AudioBed(document.getElementById("audio-toggle"));

// --- Boarding-pass widget. ---
const boardingPass = new BoardingPass({
  form: document.getElementById("pass-form"),
  nameInput: document.getElementById("pass-name"),
  decadeSelect: document.getElementById("pass-decade"),
  stage: document.getElementById("pass-stage"),
  canvas: document.getElementById("pass-canvas"),
  downloadBtn: document.getElementById("pass-download"),
  copyBtn: document.getElementById("pass-copy"),
  shareBtn: document.getElementById("pass-share"),
});

// --- Decade-weather widget. ---
const decadeWeather = new DecadeWeather({
  form: document.getElementById("weather-form"),
  decadeSelect: document.getElementById("weather-decade"),
  stage: document.getElementById("weather-stage"),
  canvas: document.getElementById("weather-canvas"),
  downloadBtn: document.getElementById("weather-download"),
  copyBtn: document.getElementById("weather-copy"),
  shareBtn: document.getElementById("weather-share"),
});

// --- Duty-Free shop. ---
renderShop(document.getElementById("shop-grid"));
initializeShopifyBuyButtons(products);

// --- Caption: show the active scene's voiceover lines. ---
const captionEl = document.getElementById("caption");
const nowShowing = document.getElementById("now-showing");
let shownIndex = -1;
function showCaption(i) {
  if (i === shownIndex || i < 0 || i >= scenes.length) return;
  shownIndex = i;
  const s = scenes[i];
  captionEl.innerHTML = s.lines
    .map((l) => `<span class="line">${l}</span>`)
    .join("");
  captionEl.classList.remove("show");
  // reflow so the fade restarts
  void captionEl.offsetWidth;
  captionEl.classList.add("show");
  nowShowing.textContent = `${String(i + 1).padStart(2, "0")} · ${s.title}`;
}

// --- Scroll → journey progress. The track scrolls past the fixed canvas. ---
function onScroll() {
  // Progress across the journey track only (terminal section comes after).
  const trackTop = track.offsetTop;
  const max = track.offsetHeight - window.innerHeight;
  const t = max > 0 ? (window.scrollY - trackTop) / max : 0;
  const clamped = Math.min(1, Math.max(0, t));
  journey.setScroll(clamped);
  showCaption(Math.round(clamped * (scenes.length - 1)));
  document.body.classList.toggle("scrolled", window.scrollY > 40);
  // Once the terminal scrolls into view, retire the floating journey overlays.
  const inTerminal = window.scrollY + window.innerHeight > trackTop + track.offsetHeight + 1;
  document.body.classList.toggle("in-terminal", inTerminal);
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

// --- Boarding gate: the entry tap is the audio gesture (sound-on by default). ---
// "Tap to board" starts the soundtrack; "enter muted" comes in silent. The gate
// owns the audio-start decision, so there is no scroll/tap autostart elsewhere.
const gate = document.getElementById("gate");
document.documentElement.style.overflow = "hidden"; // lock scroll while gated
let sharedWidgetStateRestored = false;

function parseSharedWidgetState() {
  const hash = window.location.hash.replace(/^#/, "");
  const [kind, query = ""] = hash.split("?");
  const params = new URLSearchParams(query);
  if (kind === "pass") {
    return { kind, name: params.get("name") || "", decade: params.get("decade") || "" };
  }
  if (kind === "weather") {
    return { kind, decade: params.get("decade") || "" };
  }
  return null;
}

function restoreSharedWidgetState() {
  if (sharedWidgetStateRestored) return;
  sharedWidgetStateRestored = true;
  const state = parseSharedWidgetState();
  if (!state) return;
  if (state.kind === "pass") boardingPass.issueFromLink(state);
  if (state.kind === "weather") decadeWeather.issueFromLink(state);
}

function closeGate() {
  gate.classList.add("gate-out");
  document.body.classList.remove("gated");
  document.documentElement.style.overflow = "";
  restoreSharedWidgetState();
  const hide = () => (gate.hidden = true);
  gate.addEventListener("transitionend", hide, { once: true });
  setTimeout(hide, 800); // fallback if transitionend is missed
}
document.getElementById("gate-board").addEventListener("click", () => {
  audio.start();
  closeGate();
});
document.getElementById("gate-muted").addEventListener("click", closeGate);

// --- Subtle cursor reactivity for the melt (devices with a hovering pointer). ---
if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener(
    "pointermove",
    (e) => {
      journey.setMouse(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    },
    { passive: true }
  );
}

// --- Render loop. ---
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const level = audio.sample();
  journey.setAudioLevel(level);
  journey.render();
  fish.update(dt, journey.progress / (scenes.length - 1), level);
  requestAnimationFrame(frame);
}

// Initialize and go.
showCaption(0);
onScroll();
requestAnimationFrame(frame);
