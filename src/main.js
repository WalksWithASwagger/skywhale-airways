import { Journey } from "./journey.js";
import { Fish } from "./fish-particles.js";
import { AudioBed } from "./audio.js";
import { trackEvent } from "./analytics.js";
import { scenes } from "./data/scenes.js";

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

document.getElementById("gate-board")?.addEventListener("click", () => {
  trackEvent("skywhale_board", { audio_mode: "sound_on" });
});
document.getElementById("gate-muted")?.addEventListener("click", () => {
  trackEvent("skywhale_board", { audio_mode: "muted" });
});
document.querySelectorAll(".film-link, .colophon-link").forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("skywhale_link_click", {
      link_text: link.textContent.trim(),
      link_url: link.href,
    });
  });
});

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
let sharedArtifactStateRestored = false;
let terminalModulesPromise;

function loadTerminalModules() {
  terminalModulesPromise ??= Promise.all([
    import("./artifact-lab.js"),
    import("./shop.js"),
    import("./shop-data.js"),
    import("./shopify-buy-buttons.js"),
  ]).then(([{ ArtifactLab }, { renderShop }, { products }, { initializeShopifyBuyButtons }]) => {
    const artifactLab = new ArtifactLab({
      root: document.getElementById("artifact-lab"),
      canvas: document.getElementById("artifact-canvas"),
      typeOptions: document.getElementById("artifact-type-options"),
      omenOptions: document.getElementById("artifact-omen-options"),
      decadeOptions: document.getElementById("artifact-decade-options"),
      nameInput: document.getElementById("artifact-name"),
      downloadBtn: document.getElementById("artifact-download"),
      copyBtn: document.getElementById("artifact-copy"),
      shareBtn: document.getElementById("artifact-share"),
    });

    renderShop(document.getElementById("shop-grid"));
    initializeShopifyBuyButtons(products);

    return { artifactLab };
  });

  return terminalModulesPromise;
}

function reportTerminalModuleError(error) {
  console.error("Terminal modules failed to load", error);
}

async function restoreSharedArtifactState() {
  if (sharedArtifactStateRestored) return;
  sharedArtifactStateRestored = true;
  const { artifactLab } = await loadTerminalModules();
  artifactLab.restoreFromUrl({ reveal: true });
}

function closeGate() {
  gate.classList.add("gate-out");
  document.body.classList.remove("gated");
  document.documentElement.style.overflow = "";
  void restoreSharedArtifactState().catch(reportTerminalModuleError);
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
