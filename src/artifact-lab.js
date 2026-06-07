import { trackEvent } from "./analytics.js";

const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

const OMENS = [
  { value: "wrong-minutes", label: "pocket full of wrong minutes" },
  { value: "runway-dreaming", label: "the runway was already dreaming" },
  { value: "good-pilots", label: "good pilots never do" },
  { value: "chairs-gave-up", label: "the chairs gave up" },
  { value: "fish-feelings", label: "fish traffic has feelings" },
  { value: "tomorrows-yesterday", label: "tomorrow's yesterday" },
  { value: "one-bag-one-body", label: "one bag, one body" },
  { value: "more-time", label: "more time than she left with" },
  { value: "decade-weather", label: "every decade has its own weather" },
];

const ARTIFACTS = [
  {
    value: "nomad-pass",
    label: "I AM NOMAD Pass",
    eyebrow: "Ticket counter",
    title: "I AM NOMAD",
    thumb: "merch/r5-i-am-nomad-master.webp",
    plate: "artifacts/pink-terminal-dream-frame.webp",
    art: "merch/r5-i-am-nomad-master.webp",
    defaultOmen: "more-time",
    accent: "#0f4b68",
  },
  {
    value: "receipt",
    label: "Tomorrow's Yesterday Receipt",
    eyebrow: "Claim desk",
    title: "TOMORROW'S YESTERDAY",
    thumb: "merch/r4-06-baggage-tag-memory.webp",
    plate: "artifacts/time-airport-paper-field.webp",
    art: "merch/r4-06-baggage-tag-memory.webp",
    defaultOmen: "tomorrows-yesterday",
    accent: "#b95161",
  },
  {
    value: "weather",
    label: "Decade Weather Oracle",
    eyebrow: "Weather oracle",
    title: "DECADE WEATHER",
    thumb: "merch/r4-07-decade-weather-card.webp",
    plate: "artifacts/time-airport-paper-field.webp",
    art: "merch/r4-07-decade-weather-card.webp",
    defaultOmen: "decade-weather",
    accent: "#66825f",
  },
  {
    value: "route",
    label: "Good Pilots Route",
    eyebrow: "Route office",
    title: "GOOD PILOTS ROUTE",
    thumb: "scenes/07-golden-fish-flight.webp",
    plate: "artifacts/cloud-orchard-route-field.webp",
    art: "scenes/07-golden-fish-flight.webp",
    defaultOmen: "good-pilots",
    accent: "#d49c2f",
  },
  {
    value: "sticker-sheet",
    label: "Gravity Gave Up Sticker Sheet",
    eyebrow: "Baggage memory",
    title: "GRAVITY GAVE UP",
    thumb: "merch/r4-03-terminal-relics-sticker-sheet.webp",
    plate: "artifacts/cloud-orchard-route-field.webp",
    art: "merch/r4-03-terminal-relics-sticker-sheet.webp",
    defaultOmen: "chairs-gave-up",
    accent: "#476f7c",
  },
  {
    value: "visa",
    label: "Duplicate Self Visa",
    eyebrow: "Passport control",
    title: "DUPLICATE SELF VISA",
    thumb: "scenes/04-duplicate-selves.webp",
    plate: "artifacts/pink-terminal-dream-frame.webp",
    art: "scenes/04-duplicate-selves.webp",
    defaultOmen: "one-bag-one-body",
    accent: "#b95161",
  },
];

const EXTRA_IMAGES = [
  "merch/r1-04-lyric-more-time.webp",
  "merch/r3-01-one-bag-one-body.webp",
  "merch/r3-06-runway-like-a-memory.webp",
  "merch/r2-04-lyric-weather.webp",
  "scenes/08-holding-pattern.webp",
];

const TYPE_VALUES = new Set(ARTIFACTS.map((item) => item.value));
const OMEN_VALUES = new Set(OMENS.map((item) => item.value));
const BASE = import.meta.env.BASE_URL || "/";

export class ArtifactLab {
  constructor({
    root,
    canvas,
    typeOptions,
    omenOptions,
    decadeOptions,
    nameInput,
    downloadBtn,
    copyBtn,
    shareBtn,
  }) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.typeOptions = typeOptions;
    this.omenOptions = omenOptions;
    this.decadeOptions = decadeOptions;
    this.nameInput = nameInput;
    this.downloadBtn = downloadBtn;
    this.copyBtn = copyBtn;
    this.shareBtn = shareBtn;
    this.images = new Map();
    this.state = {
      type: "nomad-pass",
      omen: "more-time",
      decade: "1970s",
      name: "",
    };

    this.renderControls();
    this.bind();
    this.draw();
    this.loadImages().then(() => this.draw());
  }

  restoreFromUrl({ reveal = false } = {}) {
    const state = parseHash(window.location.hash);
    if (!state) return false;
    this.setState(state, { track: false });
    if (reveal) this.root.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }

  renderControls() {
    this.typeOptions.innerHTML = "";
    this.omenOptions.innerHTML = "";
    this.decadeOptions.innerHTML = "";

    for (const artifact of ARTIFACTS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "artifact-type-option";
      button.dataset.key = "type";
      button.dataset.value = artifact.value;
      button.innerHTML = `
        <img src="${asset(artifact.thumb)}" alt="" loading="lazy" />
        <span>
          <strong>${artifact.label}</strong>
          <small>${artifact.eyebrow}</small>
        </span>
      `;
      button.addEventListener("click", () => {
        this.setState({ type: artifact.value, omen: artifact.defaultOmen }, { track: true });
      });
      this.typeOptions.appendChild(button);
    }

    for (const omen of OMENS) {
      this.omenOptions.appendChild(this.optionButton("omen", omen.value, omen.label, "artifact-chip"));
    }

    for (const decade of DECADES) {
      this.decadeOptions.appendChild(this.optionButton("decade", decade, decade, "artifact-chip artifact-decade"));
    }

    this.syncControls();
  }

  optionButton(key, value, label, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.key = key;
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener("click", () => this.setState({ [key]: value }, { track: true }));
    return button;
  }

  bind() {
    this.nameInput.addEventListener("input", () => {
      this.setState({ name: this.nameInput.value.trim().slice(0, 22) }, { track: false });
    });
    this.nameInput.addEventListener("change", () => this.trackGenerate());
    this.downloadBtn.addEventListener("click", () => this.download());
    this.copyBtn.addEventListener("click", () => this.copyLink());

    if (navigator.share) {
      this.shareBtn.hidden = false;
      this.shareBtn.addEventListener("click", () => this.share());
    }
  }

  setState(next, { track = false } = {}) {
    this.state = normalizeState({ ...this.state, ...next });
    if (this.nameInput.value !== this.state.name) this.nameInput.value = this.state.name;
    this.syncControls();
    this.draw();
    if (track) this.trackGenerate();
  }

  syncControls() {
    for (const button of this.root.querySelectorAll(".artifact-type-option, .artifact-chip")) {
      const active = this.state[button.dataset.key] === button.dataset.value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    const artifact = this.currentArtifact();
    const omen = this.currentOmen();
    this.canvas.setAttribute("aria-label", `${artifact.label}: ${omen.label}, arriving in the ${this.state.decade}`);
  }

  currentArtifact() {
    return ARTIFACTS.find((item) => item.value === this.state.type) || ARTIFACTS[0];
  }

  currentOmen() {
    return OMENS.find((item) => item.value === this.state.omen) || OMENS[0];
  }

  async loadImages() {
    const paths = new Set(EXTRA_IMAGES);
    for (const artifact of ARTIFACTS) {
      paths.add(artifact.thumb);
      paths.add(artifact.plate);
      paths.add(artifact.art);
    }
    await Promise.all([...paths].map((path) => this.loadImage(path)));
  }

  loadImage(path) {
    return new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        this.images.set(path, image);
        resolve();
      };
      image.onerror = () => resolve();
      image.src = asset(path);
    });
  }

  draw() {
    const artifact = this.currentArtifact();
    const omen = this.currentOmen();
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${this.state.type}:${this.state.omen}:${this.state.decade}:${this.state.name}`);

    ctx.clearRect(0, 0, W, H);
    this.drawPlate(artifact);
    drawWaves(ctx, W, H, rand);

    if (artifact.value === "nomad-pass") this.drawNomadPass(artifact, omen, rand);
    if (artifact.value === "receipt") this.drawReceipt(artifact, omen, rand);
    if (artifact.value === "weather") this.drawWeather(artifact, omen, rand);
    if (artifact.value === "route") this.drawRoute(artifact, omen, rand);
    if (artifact.value === "sticker-sheet") this.drawStickerSheet(artifact, omen, rand);
    if (artifact.value === "visa") this.drawVisa(artifact, omen);

    drawOuterFrame(ctx, W, H);
    drawGrain(ctx, W, H, rand);
  }

  drawPlate(artifact) {
    const ctx = this.ctx;
    const image = this.images.get(artifact.plate);
    if (image) {
      drawCover(ctx, image, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      const g = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      g.addColorStop(0, "#f9ead6");
      g.addColorStop(0.5, "#f4d9e3");
      g.addColorStop(1, "#cfd9ec");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    ctx.fillStyle = hexToRgba(artifact.accent, 0.08);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawNomadPass(artifact, omen, rand) {
    imageCard(this.ctx, this.images.get(artifact.art), 66, 62, 334, 500, 16, "contain");
    paperPanel(this.ctx, 430, 76, 488, 462, 20);
    kicker(this.ctx, artifact.eyebrow, 464, 126, artifact.accent);
    title(this.ctx, "I AM NOMAD", 464, 190, 384, 62, artifact.accent);
    label(this.ctx, "PASSENGER", displayName(this.state.name).toUpperCase(), 466, 278, 31, 330);
    label(this.ctx, "ARRIVING", this.state.decade, 466, 356, 35, 160);
    label(this.ctx, "SEAT", "FISH WINDOW", 680, 356, 27, 180);
    omenBanner(this.ctx, omen.label, 466, 410, 376, artifact.accent);
    stamp(this.ctx, 810, 168, "GATE", "NOMAD", artifact.accent);
    barcode(this.ctx, 468, 488, 316, 56, rand);
  }

  drawReceipt(artifact, omen, rand) {
    paperPanel(this.ctx, 76, 64, 872, 496, 12);
    imageCard(this.ctx, this.images.get(artifact.art), 612, 138, 286, 286, 14, "contain");
    kicker(this.ctx, artifact.eyebrow, 116, 118, artifact.accent);
    title(this.ctx, "TOMORROW'S YESTERDAY", 114, 184, 548, 48, artifact.accent);
    title(this.ctx, "RECEIPT", 114, 236, 360, 52, "#33242a");
    label(this.ctx, "CLAIM", claimCode(this.state, rand), 118, 338, 34, 170);
    label(this.ctx, "DECADE", this.state.decade, 316, 338, 34, 150);
    label(this.ctx, "DELAY", `${7 + Math.floor(rand() * 84)} DREAM MIN`, 470, 338, 28, 210);
    omenBanner(this.ctx, omen.label, 116, 392, 500, artifact.accent);
    script(this.ctx, "Issued for one bag, one body, and selected wrong minutes.", 118, 466, 470);
    barcode(this.ctx, 118, 496, 410, 58, rand);
  }

  drawWeather(artifact, omen, rand) {
    imageCard(this.ctx, this.images.get(artifact.art), 566, 82, 360, 360, 18, "cover");
    paperPanel(this.ctx, 74, 84, 500, 430, 18);
    kicker(this.ctx, artifact.eyebrow, 112, 136, artifact.accent);
    title(this.ctx, "DECADE WEATHER", 112, 204, 430, 56, artifact.accent);
    label(this.ctx, "ARRIVING", this.state.decade, 116, 292, 34, 160);
    label(this.ctx, "VISIBILITY", visibilityLine(this.state.omen), 116, 370, 25, 410);
    omenBanner(this.ctx, omen.label, 116, 418, 396, artifact.accent);
    weatherGlyphs(this.ctx, 658, 488, rand, artifact.accent);
    script(this.ctx, "Every decade has its own weather. Dress for the year that answers.", 116, 502, 500);
  }

  drawRoute(artifact, omen, rand) {
    imageCard(this.ctx, this.images.get(artifact.art), 78, 76, 866, 306, 18, "cover");
    paperPanel(this.ctx, 92, 396, 850, 168, 18);
    kicker(this.ctx, artifact.eyebrow, 124, 440, artifact.accent);
    title(this.ctx, "GOOD PILOTS ROUTE", 124, 502, 500, 46, "#33242a");
    label(this.ctx, "FROM", "NOW", 624, 472, 27, 110);
    label(this.ctx, "TO", this.state.decade, 760, 472, 27, 130);
    omenBanner(this.ctx, omen.label, 624, 506, 276, artifact.accent);
    routeArc(this.ctx, 140, 140, 764, 160, rand, artifact.accent);
  }

  drawStickerSheet(artifact, omen, rand) {
    imageCard(this.ctx, this.images.get(artifact.art), 552, 72, 350, 350, 22, "contain");
    paperPanel(this.ctx, 84, 76, 466, 454, 18);
    kicker(this.ctx, artifact.eyebrow, 120, 130, artifact.accent);
    title(this.ctx, "GRAVITY", 120, 202, 362, 60, artifact.accent);
    title(this.ctx, "GAVE UP", 120, 260, 360, 58, "#33242a");
    label(this.ctx, "ARRIVING", this.state.decade, 124, 348, 33, 160);
    omenBanner(this.ctx, omen.label, 124, 398, 350, artifact.accent);
    imageCard(this.ctx, this.images.get("merch/r3-06-runway-like-a-memory.webp"), 126, 472, 126, 76, 12, "contain");
    imageCard(this.ctx, this.images.get("merch/r1-04-lyric-more-time.webp"), 270, 472, 126, 76, 12, "contain");
    imageCard(this.ctx, this.images.get("merch/r3-01-one-bag-one-body.webp"), 414, 472, 126, 76, 12, "contain");
    stamp(this.ctx, 846, 500, "GATE", "STICKERS", artifact.accent);
    routeArc(this.ctx, 570, 430, 260, 90, rand, artifact.accent);
  }

  drawVisa(artifact, omen) {
    imageCard(this.ctx, this.images.get(artifact.art), 70, 86, 442, 330, 18, "cover");
    paperPanel(this.ctx, 536, 88, 380, 430, 18);
    kicker(this.ctx, artifact.eyebrow, 570, 142, artifact.accent);
    title(this.ctx, "DUPLICATE", 570, 210, 300, 50, artifact.accent);
    title(this.ctx, "SELF VISA", 570, 262, 300, 50, "#33242a");
    label(this.ctx, "TRAVELER", displayName(this.state.name).toUpperCase(), 574, 344, 27, 280);
    label(this.ctx, "ARRIVING", this.state.decade, 574, 420, 31, 160);
    omenBanner(this.ctx, omen.label, 574, 456, 282, artifact.accent);
    stamp(this.ctx, 418, 458, "CLEARED", "MEMORY", artifact.accent);
  }

  filename() {
    return `skywhale-${this.state.type}-${this.state.decade}.png`;
  }

  shareUrl() {
    const params = new URLSearchParams({
      type: this.state.type,
      omen: this.state.omen,
      decade: this.state.decade,
    });
    if (this.state.name) params.set("name", this.state.name);
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `artifact?${params.toString()}`;
    return url.toString();
  }

  payload() {
    return {
      type: this.state.type,
      omen: this.state.omen,
      decade: this.state.decade,
    };
  }

  trackGenerate() {
    trackEvent("artifact_lab_generate", this.payload());
  }

  download() {
    const link = document.createElement("a");
    link.download = this.filename();
    link.href = this.canvas.toDataURL("image/png");
    link.click();
    trackEvent("artifact_lab_download", this.payload());
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.shareUrl());
      this.flashCopyStatus("Copied");
      trackEvent("artifact_lab_copy", this.payload());
    } catch {
      this.flashCopyStatus("Copy failed");
    }
  }

  flashCopyStatus(text) {
    this.copyBtn.textContent = text;
    clearTimeout(this.copyReset);
    this.copyReset = window.setTimeout(() => {
      this.copyBtn.textContent = "Copy link";
    }, 1400);
  }

  async share() {
    try {
      const blob = await new Promise((resolve) => this.canvas.toBlob(resolve, "image/png"));
      const file = new File([blob], this.filename(), { type: "image/png" });
      const sharePayload = {
        files: [file],
        title: this.currentArtifact().label,
        text: `Issued at Gate Infinity by Skywhale Airways: ${this.currentOmen().label}.`,
      };
      if (navigator.canShare?.(sharePayload)) {
        await navigator.share(sharePayload);
        trackEvent("artifact_lab_share", this.payload());
      }
    } catch {
      // share dismissed
    }
  }
}

function parseHash(hash) {
  const clean = hash.replace(/^#/, "");
  const [kind, query = ""] = clean.split("?");
  const params = new URLSearchParams(query);
  if (kind === "artifact") {
    return normalizeState({
      type: params.get("type") || "",
      omen: params.get("omen") || "",
      decade: params.get("decade") || "",
      name: params.get("name") || "",
    });
  }

  const legacy = {
    pass: { type: "nomad-pass", omen: "more-time" },
    weather: { type: "weather", omen: "decade-weather" },
    stamp: { type: "visa", omen: "one-bag-one-body" },
    receipt: { type: "receipt", omen: receiptOmen(params.get("delay")) },
    route: { type: "route", omen: routeOmen(params.get("mood")) },
    manifest: { type: "sticker-sheet", omen: "chairs-gave-up" },
  }[kind];
  if (!legacy) return null;

  return normalizeState({
    type: legacy.type,
    omen: legacy.omen,
    decade: params.get("decade") || params.get("destination") || params.get("origin") || "1970s",
    name: params.get("name") || "",
  });
}

function receiptOmen(delay) {
  if (delay === "weather") return "decade-weather";
  if (delay === "duplicate") return "one-bag-one-body";
  if (delay === "fish") return "fish-feelings";
  if (delay === "baggage") return "tomorrows-yesterday";
  return "chairs-gave-up";
}

function routeOmen(mood) {
  if (mood === "memory") return "runway-dreaming";
  if (mood === "orchard") return "more-time";
  return "good-pilots";
}

function normalizeState(state) {
  const type = TYPE_VALUES.has(state.type) ? state.type : "nomad-pass";
  const fallbackOmen = ARTIFACTS.find((item) => item.value === type)?.defaultOmen || "more-time";
  return {
    type,
    omen: OMEN_VALUES.has(state.omen) ? state.omen : fallbackOmen,
    decade: DECADES.includes(state.decade) ? state.decade : "1970s",
    name: String(state.name || "").trim().slice(0, 22),
  };
}

function asset(path) {
  return `${BASE}${path}`;
}

function displayName(name) {
  return name || "Time Traveller";
}

function claimCode(state, rand) {
  const seed = `${state.type}${state.omen}${state.decade}${state.name}`;
  const sum = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `TY-${String((sum + Math.floor(rand() * 9000)) % 10000).padStart(4, "0")}`;
}

function visibilityLine(omen) {
  if (omen === "fish-feelings") return "Fish traffic visible in feelings";
  if (omen === "chairs-gave-up") return "Floor advisory: optional";
  if (omen === "wrong-minutes") return "Clear sideways, late forward";
  if (omen === "runway-dreaming") return "Runway visible in dreams";
  return "Beautifully strange";
}

function rng(text) {
  let n = [...text].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
}

function paperPanel(ctx, x, y, w, h, r) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 248, 230, 0.86)";
  ctx.strokeStyle = "rgba(50,35,40,0.2)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function imageCard(ctx, image, x, y, w, h, r, mode = "cover") {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = "rgba(255,248,230,0.72)";
  ctx.fillRect(x, y, w, h);
  if (image) {
    if (mode === "contain") drawContain(ctx, image, x, y, w, h);
    else drawCover(ctx, image, x, y, w, h);
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = "rgba(50,35,40,0.26)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.restore();
}

function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawContain(ctx, image, x, y, w, h) {
  const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawWaves(ctx, W, H, rand) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 9; i++) {
    const y = 48 + i * 70 + rand() * 20;
    ctx.strokeStyle = i % 2 ? "rgba(199,74,92,0.34)" : "rgba(53,94,103,0.28)";
    ctx.lineWidth = 1.5 + rand() * 2;
    ctx.beginPath();
    ctx.moveTo(-20, y);
    for (let x = -20; x <= W + 40; x += 80) {
      ctx.quadraticCurveTo(x + 38, y + Math.sin((x + i * 17) * 0.02) * 28, x + 80, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrain(ctx, W, H, rand) {
  ctx.save();
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = `rgba(45,32,35,${rand() * 0.045})`;
    ctx.fillRect(rand() * W, rand() * H, 1.2, 1.2);
  }
  ctx.restore();
}

function drawOuterFrame(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = "rgba(50,35,40,0.46)";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, W - 64, H - 64);
  ctx.strokeStyle = "rgba(255,248,232,0.62)";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.restore();
}

function kicker(ctx, text, x, y, accent) {
  ctx.fillStyle = hexToRgba(accent, 0.88);
  ctx.font = "700 16px Georgia, serif";
  ctx.fillText(text.toUpperCase(), x, y);
}

function title(ctx, text, x, y, maxWidth, size, color) {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px Georgia, 'Times New Roman', serif`;
  fitText(ctx, text, x, y, maxWidth, size);
}

function label(ctx, name, value, x, y, size, maxWidth) {
  ctx.fillStyle = "rgba(50,35,40,0.56)";
  ctx.font = "700 13px Georgia, serif";
  ctx.fillText(name, x, y - size - 8);
  ctx.fillStyle = "#33242a";
  ctx.font = `700 ${size}px Georgia, 'Times New Roman', serif`;
  fitText(ctx, value, x, y, maxWidth, size);
}

function omenBanner(ctx, text, x, y, w, accent) {
  ctx.save();
  ctx.fillStyle = hexToRgba(accent, 0.86);
  roundRect(ctx, x, y, w, 62, 8);
  ctx.fill();
  ctx.fillStyle = "#fff8e8";
  ctx.font = "700 18px Georgia, serif";
  wrapText(ctx, text.toUpperCase(), x + 18, y + 26, w - 36, 20, 2);
  ctx.restore();
}

function script(ctx, text, x, y, w) {
  ctx.fillStyle = "rgba(50,35,40,0.74)";
  ctx.font = "italic 20px Georgia, serif";
  wrapText(ctx, text, x, y, w, 25, 2);
}

function stamp(ctx, x, y, top, bottom, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.13);
  ctx.strokeStyle = hexToRgba(accent, 0.78);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, 92, 64, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 72, 46, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = hexToRgba(accent, 0.88);
  ctx.font = "700 17px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(top, 0, -8);
  ctx.font = "700 19px Georgia, serif";
  ctx.fillText(bottom, 0, 18);
  ctx.restore();
}

function barcode(ctx, x, y, w, h, rand) {
  ctx.save();
  ctx.fillStyle = "rgba(50,35,40,0.78)";
  let bx = x;
  while (bx < x + w) {
    const bw = 2 + Math.round(rand() * 6);
    ctx.fillRect(bx, y, bw, h);
    bx += bw + 3 + Math.round(rand() * 4);
  }
  ctx.restore();
}

function weatherGlyphs(ctx, x, y, rand, accent) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(accent, 0.78);
  ctx.fillStyle = "rgba(255,248,230,0.78)";
  for (let i = 0; i < 5; i++) {
    const px = x + i * 44;
    const py = y + Math.sin(i * 1.8) * 18;
    ctx.beginPath();
    ctx.arc(px, py, 24 + rand() * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function routeArc(ctx, x, y, w, h, rand, accent) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(accent, 0.9);
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 14]);
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.7);
  ctx.bezierCurveTo(x + w * 0.26, y - h * 0.32, x + w * 0.58, y + h * 1.24, x + w, y + h * 0.22);
  ctx.stroke();
  ctx.setLineDash([]);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? "rgba(199,74,92,0.78)" : "rgba(242,193,78,0.82)";
    ctx.beginPath();
    ctx.arc(x + rand() * w, y + rand() * h, 8 + rand() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function fitText(ctx, text, x, y, maxWidth, startSize) {
  let size = startSize;
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(text, x, y);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((item, i) => ctx.fillText(item, x, y + i * lineHeight));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
