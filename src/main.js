import { AudioBed } from "./audio.js";
import { FilmPlayer } from "./film-player.js";
import { trackEvent } from "./analytics.js";

const gate = document.getElementById("gate");
const filmSlot = document.getElementById("film-slot");
const watch = document.getElementById("gate-watch");
const underlay = [...document.body.children].filter(
  (el) => el !== gate && el.tagName !== "SCRIPT"
);
const film = new FilmPlayer(document.querySelector("#film-frame iframe"), {
  onPlaying: () => audio.pause(),
  onUnavailable: () => {
    document.getElementById("film-status").textContent =
      "Use the film’s own sound controls. Airport sound is unavailable for now.";
    document.getElementById("audio-status").textContent =
      "Airport sound is unavailable for now.";
  },
  onReady: () => {
    document.getElementById("film-status").textContent = "";
    document.getElementById("audio-status").textContent = "";
  },
});
const audio = new AudioBed(document.getElementById("audio-toggle"), {
  beforePlay: () => film.pause(),
});
let portal;
let portalModule;
let navigation = 0;

function closeGate() {
  gate.hidden = true;
  document.body.classList.remove("gated");
  underlay.forEach((el) => {
    el.inert = false;
  });
}

function focusDestination(id) {
  document.getElementById(id).focus({ preventScroll: true });
}

function enterTerminal(inTerminal = true) {
  document.body.classList.toggle("in-terminal", inTerminal);
  if (inTerminal) {
    audio.pause();
    film.enter();
  }
}

function showFilm() {
  navigation++;
  setJourneyStatus("");
  closeGate();
  enterTerminal();
  filmSlot.scrollIntoView({ behavior: "instant", block: "start" });
  focusDestination("film-title");
  void restoreTerminal();
}

function setJourneyStatus(message) {
  document.querySelectorAll(".journey-status").forEach((el) => {
    el.textContent = message;
  });
}

async function wander(withSound) {
  const attempt = ++navigation;
  setJourneyStatus("Opening the airport… You can watch the film at any time.");
  if (withSound) void audio.start();
  else audio.pause();
  try {
    if (
      location.hash &&
      location.hash !== "#film-slot" &&
      location.hash !== "#scroll-track"
    ) {
      const { artifactLab } = await restoreTerminal();
      if (attempt !== navigation) return;
      if (artifactLab?.restoreFromUrl()) {
        setJourneyStatus("");
        closeGate();
        enterTerminal();
        artifactLab.restoreFromUrl({ reveal: true });
        focusDestination("artifacts-title");
        return;
      }
    }
    portalModule ??= import("./portal.js");
    const { createPortal } = await portalModule;
    if (attempt !== navigation) return;
    portal ??= createPortal(audio, enterTerminal);
    setJourneyStatus("");
    closeGate();
    document.body.classList.add("portal-ready");
    void restoreTerminal();
    history.pushState(null, "", "#scroll-track");
    document
      .getElementById("scroll-track")
      .scrollIntoView({ behavior: "instant" });
    portal.refresh();
    focusDestination("journey-watch");
  } catch {
    if (attempt !== navigation) return;
    audio.pause();
    setJourneyStatus("The airport couldn’t open. The film is ready to watch.");
  }
}

let terminalModulesPromise;

function loadTerminalModules() {
  if (!terminalModulesPromise) {
    document.getElementById("artifact-status").textContent =
      "Preparing your souvenir…";
  }
  terminalModulesPromise ??= Promise.all([
    import("./artifact-lab.js"),
    import("./shop.js"),
    import("./shop-data.js"),
    import("./shopify-buy-buttons.js"),
  ]).then(
    ([
      { ArtifactLab },
      { renderShop },
      { products },
      { initializeShopifyBuyButtons },
    ]) => {
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

      document.getElementById("artifact-status").textContent = "";
      document.querySelector(".artifact-lab-shell").inert = false;
      return { artifactLab };
    }
  );

  return terminalModulesPromise;
}

async function restoreTerminal() {
  try {
    const result = await loadTerminalModules();
    return result;
  } catch {
    document.getElementById("artifact-status").textContent =
      "The souvenir desk couldn’t open. You can still watch the film; reload to try the desk again.";
    return {};
  }
}

function followHash() {
  if (location.hash === "#film-slot") showFilm();
  else if (location.hash === "#artifact-lab" && gate.hidden) {
    enterTerminal();
    focusDestination("artifacts-title");
  } else if (location.hash === "#scroll-track" && gate.hidden && portal) {
    portal.refresh();
    focusDestination("journey-watch");
  }
}

document.querySelectorAll('[href="#film-slot"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (location.hash !== "#film-slot")
      history.pushState(null, "", "#film-slot");
    showFilm();
  });
});
document.getElementById("gate-board").addEventListener("click", () => {
  trackEvent("skywhale_board", { audio_mode: "sound_on" });
  void wander(true);
});
document.getElementById("gate-muted").addEventListener("click", () => {
  trackEvent("skywhale_board", { audio_mode: "muted" });
  void wander(false);
});
document.getElementById("film-wander").addEventListener("click", () => {
  void wander(false);
});
document.querySelectorAll("a.film-link, a.colophon-link").forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("skywhale_link_click", {
      link_text: link.textContent.trim(),
      link_url: link.href,
    });
  });
});
window.addEventListener("hashchange", followHash);
window.addEventListener("popstate", followHash);
gate.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    watch.click();
  }
  if (event.key !== "Tab") return;
  const controls = [...gate.querySelectorAll("a, button")].filter(
    (el) => !el.disabled && !el.hidden
  );
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

// Enhance only after the entry handlers exist; static HTML remains a usable film page.
document.querySelectorAll("[data-needs-js]").forEach((el) => {
  el.hidden = false;
});
document.querySelector(".artifact-lab-shell").inert = true;
if (location.hash === "#film-slot" || location.hash === "#artifact-lab") {
  showFilm();
  if (location.hash === "#artifact-lab") {
    document
      .getElementById("artifact-lab")
      .scrollIntoView({ behavior: "instant" });
    focusDestination("artifacts-title");
  }
} else {
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.setAttribute("aria-labelledby", "gate-title");
  document.body.classList.add("gated");
  underlay.forEach((el) => {
    el.inert = true;
  });
  watch.focus({ preventScroll: true });
}
