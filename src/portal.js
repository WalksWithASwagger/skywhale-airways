import { Journey } from "./journey.js";
import { Fish } from "./fish-particles.js";
import { scenes } from "./data/scenes.js";

export function createPortal(audio, onTerminalChange) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const track = document.getElementById("scroll-track");
  const smallScreen = window.matchMedia(
    "(max-width: 768px), (hover: none)"
  ).matches;
  const journey = new Journey(document.getElementById("gl"), { reducedMotion });
  const fish = new Fish(journey.scene, {
    reducedMotion,
    count: smallScreen ? 18 : 36,
  });
  scenes.forEach((s, i) => {
    const panel = document.createElement("section");
    panel.className = "scene-panel";
    panel.dataset.index = String(i);
    panel.setAttribute("aria-label", s.title);
    track.appendChild(panel);
  });
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
    const inTerminal =
      window.scrollY + window.innerHeight > trackTop + track.offsetHeight + 1;
    onTerminalChange(inTerminal);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

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
  return { refresh: onScroll };
}
