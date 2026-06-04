const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

const DELAYS = [
  {
    value: "gravity",
    label: "Gravity",
    code: "GRV",
    reason: "Gravity stopped insisting",
    line: "Passenger cleared for sideways boarding.",
  },
  {
    value: "duplicate",
    label: "Duplicate self",
    code: "DUP",
    reason: "Another you reached the gate first",
    line: "Please keep both versions within sight.",
  },
  {
    value: "fish",
    label: "Fish traffic",
    code: "FIN",
    reason: "Fish-aircraft holding over pink tarmac",
    line: "The runway will reopen when the fins align.",
  },
  {
    value: "weather",
    label: "Decade weather",
    code: "WX",
    reason: "Weather arrived from a softer year",
    line: "Umbrellas may remember the wrong decade.",
  },
  {
    value: "baggage",
    label: "Baggage memory",
    code: "BAG",
    reason: "A suitcase began remembering out loud",
    line: "Claim checks are valid until tomorrow's yesterday.",
  },
];

const ROUTE_MOODS = [
  { value: "orchard", label: "Cloud orchard", line: "Layover fruit ripening above the runway" },
  { value: "neon", label: "Neon drift", line: "Terminal lights humming in future blue" },
  { value: "pink", label: "Pink rotunda", line: "Arrival hall breathing rose-colored time" },
  { value: "golden", label: "Golden fish", line: "A good pilot with fins and no questions" },
  { value: "memory", label: "Memory runway", line: "The runway opens like a memory" },
];

const RELICS = [
  { value: "fish", label: "Fish-aircraft", code: "FIN" },
  { value: "clock", label: "Wrong-minute clock", code: "CLK" },
  { value: "orchard", label: "Cloud orchard fruit", code: "CLD" },
  { value: "chair", label: "Duplicate gate chair", code: "DUP" },
  { value: "suitcase", label: "Memory suitcase", code: "BAG" },
  { value: "route", label: "Route arc", code: "ARC" },
  { value: "gate", label: "Gate infinity", code: "INF" },
  { value: "plane", label: "Tiny plane", code: "PLN" },
];

class CanvasArtifact {
  constructor({ stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    this.stage = stage;
    this.canvas = canvas;
    this.downloadBtn = downloadBtn;
    this.copyBtn = copyBtn;
    this.shareBtn = shareBtn;
    this.ctx = canvas.getContext("2d");

    this.downloadBtn.addEventListener("click", () => this.download());
    if (this.copyBtn && navigator.clipboard?.writeText) {
      this.copyBtn.hidden = false;
      this.copyBtn.addEventListener("click", () => this.copyLink());
    }
    if ("share" in navigator && "canShare" in navigator) {
      this.shareBtn.hidden = false;
      this.shareBtn.addEventListener("click", () => this.share());
    }
  }

  reveal() {
    this.stage.hidden = false;
    this.stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  filename() {
    return "skywhale-artifact.png";
  }

  shareUrl() {
    return window.location.href;
  }

  shareTitle() {
    return "Skywhale Airways artifact";
  }

  shareText() {
    return "Issued at Gate Infinity by Skywhale Airways.";
  }

  download() {
    const a = document.createElement("a");
    a.download = this.filename();
    a.href = this.canvas.toDataURL("image/png");
    a.click();
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.shareUrl());
      this.flashCopyStatus("Copied");
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
      const blob = await new Promise((res) => this.canvas.toBlob(res, "image/png"));
      const file = new File([blob], this.filename(), { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: this.shareTitle(),
          text: this.shareText(),
        });
      }
    } catch {
      // share dismissed
    }
  }
}

export class GateReceipt extends CanvasArtifact {
  constructor({ form, decadeSelect, delaySelect, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    super({ stage, canvas, downloadBtn, copyBtn, shareBtn });
    this.form = form;
    this.decadeSelect = decadeSelect;
    this.delaySelect = delaySelect;

    populate(this.decadeSelect, DECADES.map((d) => ({ value: d, label: d })));
    populate(this.delaySelect, DELAYS);
    this.decadeSelect.value = "1970s";
    this.delaySelect.value = "gravity";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.issue();
    });
  }

  issueFromLink({ decade, delay }) {
    setValue(this.decadeSelect, decade);
    setValue(this.delaySelect, delay);
    this.issue();
  }

  issue() {
    this.data = this.details();
    this.draw(this.data);
    this.reveal();
  }

  details() {
    const decade = this.decadeSelect.value;
    const delay = DELAYS.find((item) => item.value === this.delaySelect.value) || DELAYS[0];
    const n = seed(`${decade}${delay.value}`);
    return {
      decade,
      delay,
      claim: `${delay.code}-${String(n % 10000).padStart(4, "0")}`,
      gate: n % 3 === 0 ? "∞" : String((n % 29) + 1),
      minutes: 7 + (n % 83),
    };
  }

  draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${d.decade}${d.delay.value}`);
    paper(ctx, W, H, rand);
    border(ctx, W, H);
    perforation(ctx, W, H);

    routeArc(ctx, 84, 118, 840, 120, "rgba(53,94,103,0.34)");
    fish(ctx, 812, 116, 38, "rgba(194,135,46,0.68)");
    fish(ctx, 872, 154, 22, "rgba(53,94,103,0.52)");
    clock(ctx, 826, 462, 58);
    baggageTag(ctx, 148, 474, "CLAIM");

    ctx.fillStyle = "#33242a";
    ctx.textBaseline = "alphabetic";
    ctx.font = "700 31px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 76, 92);
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.68)";
    ctx.fillText("Gate Infinity delay receipt", 76, 122);

    ctx.fillStyle = "rgba(255,251,240,0.74)";
    ctx.strokeStyle = "rgba(50,35,40,0.28)";
    ctx.lineWidth = 2;
    ctx.fillRect(76, 164, 872, 300);
    ctx.strokeRect(76, 164, 872, 300);

    ctx.fillStyle = "rgba(199,74,92,0.86)";
    ctx.font = "700 58px Georgia, serif";
    ctx.fillText("GATE RECEIPT", 112, 236);
    field(ctx, "DECADE", d.decade, 114, 318, 34);
    field(ctx, "CLAIM", d.claim, 354, 318, 34);
    field(ctx, "GATE", d.gate, 604, 318, 34);
    field(ctx, "DELAY", `${d.minutes} DREAM MIN`, 734, 318, 30);

    ctx.fillStyle = "rgba(53,94,103,0.76)";
    ctx.fillRect(112, 352, 760, 52);
    ctx.fillStyle = "#fff";
    ctx.font = "700 25px Georgia, serif";
    wrap(ctx, d.delay.reason.toUpperCase(), 132, 386, 720, 30);

    ctx.fillStyle = "rgba(50,35,40,0.74)";
    ctx.font = "italic 25px Georgia, serif";
    wrap(ctx, d.delay.line, 114, 444, 610, 31);

    stamp(ctx, 814, 520, "GATE", "RECEIVED");
    barcode(ctx, 114, 544, 380, 68, rand);
  }

  filename() {
    return `skywhale-gate-receipt-${this.data?.decade || "1970s"}.png`;
  }

  shareUrl() {
    const data = this.data || this.details();
    const params = new URLSearchParams({
      decade: data.decade,
      delay: data.delay.value,
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `receipt?${params.toString()}`;
    return url.toString();
  }

  shareTitle() {
    return "My Skywhale Airways gate receipt";
  }
}

export class RoutePostcard extends CanvasArtifact {
  constructor({ form, originSelect, destinationSelect, moodSelect, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    super({ stage, canvas, downloadBtn, copyBtn, shareBtn });
    this.form = form;
    this.originSelect = originSelect;
    this.destinationSelect = destinationSelect;
    this.moodSelect = moodSelect;

    const decadeOptions = DECADES.map((d) => ({ value: d, label: d }));
    populate(this.originSelect, decadeOptions);
    populate(this.destinationSelect, decadeOptions);
    populate(this.moodSelect, ROUTE_MOODS);
    this.originSelect.value = "1970s";
    this.destinationSelect.value = "1990s";
    this.moodSelect.value = "golden";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.issue();
    });
  }

  issueFromLink({ origin, destination, mood }) {
    setValue(this.originSelect, origin);
    setValue(this.destinationSelect, destination);
    setValue(this.moodSelect, mood);
    this.issue();
  }

  issue() {
    this.data = this.details();
    this.draw(this.data);
    this.reveal();
  }

  details() {
    const origin = this.originSelect.value;
    const destination = this.destinationSelect.value;
    const mood = ROUTE_MOODS.find((item) => item.value === this.moodSelect.value) || ROUTE_MOODS[0];
    const n = seed(`${origin}${destination}${mood.value}`);
    return {
      origin,
      destination,
      mood,
      route: `SW-${100 + (n % 899)}`,
      miles: `${(n % 7) + 2}.${n % 10} decades`,
    };
  }

  draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${d.origin}${d.destination}${d.mood.value}`);
    paper(ctx, W, H, rand);
    border(ctx, W, H);
    postcardBack(ctx, W, H);

    cloud(ctx, 126, 142, 62);
    cloud(ctx, 702, 108, 78);
    cloud(ctx, 626, 486, 50);
    skywhale(ctx, 470, 152, 58, "rgba(194,135,46,0.7)");

    const points = [
      [156, 438],
      [300, 266],
      [506, 374],
      [706, 218],
      [856, 408],
    ];
    ctx.save();
    ctx.strokeStyle = "rgba(53,94,103,0.68)";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.bezierCurveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]);
    ctx.bezierCurveTo(points[3][0] + 80, points[3][1] + 96, points[4][0] - 120, points[4][1] - 72, points[4][0], points[4][1]);
    ctx.stroke();
    ctx.restore();

    for (const [i, p] of points.entries()) {
      fish(ctx, p[0], p[1], i === 0 || i === points.length - 1 ? 24 : 14, i % 2 ? "rgba(199,74,92,0.55)" : "rgba(242,193,78,0.68)");
    }

    ctx.fillStyle = "#33242a";
    ctx.font = "700 30px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 74, 88);
    ctx.font = "700 52px Georgia, serif";
    ctx.fillStyle = "rgba(199,74,92,0.86)";
    ctx.fillText("ROUTE MAP", 74, 154);
    ctx.font = "italic 20px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.68)";
    ctx.fillText(d.mood.line, 76, 184);

    ctx.fillStyle = "rgba(255,251,240,0.72)";
    ctx.strokeStyle = "rgba(50,35,40,0.26)";
    ctx.lineWidth = 2;
    ctx.fillRect(74, 496, 618, 78);
    ctx.strokeRect(74, 496, 618, 78);
    field(ctx, "ORIGIN", d.origin, 98, 548, 31);
    field(ctx, "DESTINATION", d.destination, 292, 548, 31);
    field(ctx, "ROUTE", d.route, 530, 548, 27);

    ctx.save();
    ctx.translate(814, 538);
    ctx.rotate(-0.08);
    ctx.strokeStyle = "rgba(199,74,92,0.76)";
    ctx.lineWidth = 4;
    ctx.strokeRect(-92, -42, 184, 84);
    ctx.fillStyle = "rgba(199,74,92,0.84)";
    ctx.textAlign = "center";
    ctx.font = "700 19px Georgia, serif";
    ctx.fillText("POSTCARD", 0, -8);
    ctx.font = "700 24px Georgia, serif";
    ctx.fillText("GATE ∞", 0, 24);
    ctx.restore();

    ctx.fillStyle = "rgba(50,35,40,0.62)";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText(`Distance: ${d.miles}, subject to weather from another decade.`, 76, 608);
  }

  filename() {
    const data = this.data || this.details();
    return `skywhale-route-map-${data.origin}-to-${data.destination}.png`;
  }

  shareUrl() {
    const data = this.data || this.details();
    const params = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      mood: data.mood.value,
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `route?${params.toString()}`;
    return url.toString();
  }

  shareTitle() {
    return "My Skywhale Airways route map";
  }
}

export class SuitcaseManifest extends CanvasArtifact {
  constructor({ form, decadeSelect, relicSelects, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    super({ stage, canvas, downloadBtn, copyBtn, shareBtn });
    this.form = form;
    this.decadeSelect = decadeSelect;
    this.relicSelects = relicSelects;

    populate(this.decadeSelect, DECADES.map((d) => ({ value: d, label: d })));
    for (const select of this.relicSelects) populate(select, RELICS);
    this.decadeSelect.value = "1970s";
    this.relicSelects[0].value = "fish";
    this.relicSelects[1].value = "clock";
    this.relicSelects[2].value = "gate";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.issue();
    });
  }

  issueFromLink({ decade, relics }) {
    setValue(this.decadeSelect, decade);
    const values = String(relics || "").split(",").filter(Boolean);
    this.relicSelects.forEach((select, i) => setValue(select, values[i]));
    this.issue();
  }

  issue() {
    this.data = this.details();
    this.draw(this.data);
    this.reveal();
  }

  details() {
    const decade = this.decadeSelect.value;
    const relics = this.relicSelects.map((select) => RELICS.find((item) => item.value === select.value) || RELICS[0]);
    const n = seed(`${decade}${relics.map((item) => item.value).join("")}`);
    return {
      decade,
      relics,
      tag: `BOF-${String(n % 1000).padStart(3, "0")}`,
      advisory: "Pack only what still recognizes you.",
    };
  }

  draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${d.decade}${d.relics.map((item) => item.value).join("")}`);
    paper(ctx, W, H, rand);
    border(ctx, W, H);
    perforation(ctx, W, H);

    routeArc(ctx, 112, 116, 770, 108, "rgba(53,94,103,0.3)");
    skywhale(ctx, 776, 126, 56, "rgba(194,135,46,0.72)");
    baggageTag(ctx, 142, 142, d.tag);

    ctx.fillStyle = "#33242a";
    ctx.font = "700 30px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 76, 88);
    ctx.font = "700 49px Georgia, serif";
    ctx.fillStyle = "rgba(199,74,92,0.86)";
    ctx.fillText("SUITCASE MANIFEST", 76, 234);
    ctx.font = "italic 19px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.68)";
    ctx.fillText("Issued for one bag, one body, and selected terminal relics", 78, 266);

    const slots = [
      [116, 330],
      [388, 330],
      [660, 330],
    ];
    d.relics.forEach((relic, i) => {
      this.drawSticker(ctx, relic, slots[i][0], slots[i][1], 190, rand);
    });

    ctx.fillStyle = "rgba(255,251,240,0.74)";
    ctx.strokeStyle = "rgba(50,35,40,0.26)";
    ctx.lineWidth = 2;
    ctx.fillRect(112, 526, 800, 70);
    ctx.strokeRect(112, 526, 800, 70);
    field(ctx, "DECADE", d.decade, 136, 574, 28);
    field(ctx, "TAG", d.tag, 322, 574, 28);
    ctx.fillStyle = "rgba(50,35,40,0.72)";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText(d.advisory, 482, 574);
  }

  drawSticker(ctx, relic, x, y, size, rand) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((rand() - 0.5) * 0.16);
    ctx.fillStyle = "rgba(255,251,240,0.78)";
    ctx.strokeStyle = "rgba(50,35,40,0.28)";
    ctx.lineWidth = 3;
    roundedRect(ctx, -size / 2, -size / 2, size, size, 18);
    ctx.fill();
    ctx.stroke();

    const iconColor = relic.value === "gate" ? "rgba(199,74,92,0.8)" : "rgba(53,94,103,0.76)";
    if (relic.value === "fish") fish(ctx, 0, -22, 42, "rgba(194,135,46,0.78)");
    if (relic.value === "clock") clock(ctx, 0, -22, 42);
    if (relic.value === "orchard") cloud(ctx, -52, -40, 34);
    if (relic.value === "chair") chair(ctx, 0, -16, iconColor);
    if (relic.value === "suitcase") suitcase(ctx, 0, -18, iconColor);
    if (relic.value === "route") routeArc(ctx, -62, -42, 124, 54, iconColor);
    if (relic.value === "gate") infinity(ctx, 0, -18, iconColor);
    if (relic.value === "plane") tinyPlane(ctx, 0, -20, iconColor);

    ctx.fillStyle = "rgba(50,35,40,0.76)";
    ctx.textAlign = "center";
    ctx.font = "700 16px Georgia, serif";
    wrapCentered(ctx, relic.label.toUpperCase(), 0, 56, 150, 20);
    ctx.font = "700 13px Georgia, serif";
    ctx.fillStyle = "rgba(199,74,92,0.78)";
    ctx.fillText(relic.code, 0, 84);
    ctx.restore();
  }

  filename() {
    return `skywhale-suitcase-manifest-${this.data?.decade || "1970s"}.png`;
  }

  shareUrl() {
    const data = this.data || this.details();
    const params = new URLSearchParams({
      decade: data.decade,
      relics: data.relics.map((item) => item.value).join(","),
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `manifest?${params.toString()}`;
    return url.toString();
  }

  shareTitle() {
    return "My Skywhale Airways suitcase manifest";
  }
}

function populate(select, options) {
  for (const option of options) {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  }
}

function setValue(select, value) {
  if ([...select.options].some((option) => option.value === value)) select.value = value;
}

function seed(text) {
  return [...text].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function rng(text) {
  let n = seed(text);
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
}

function paper(ctx, W, H, rand) {
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#f9ead6");
  g.addColorStop(0.5, "#f4d9e3");
  g.addColorStop(1, "#cfd9ec");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 1450; i++) {
    ctx.fillStyle = `rgba(55,40,42,${rand() * 0.04})`;
    ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
  }
}

function border(ctx, W, H) {
  ctx.strokeStyle = "rgba(50,35,40,0.54)";
  ctx.lineWidth = 3;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.strokeStyle = "rgba(53,94,103,0.42)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, W - 104, H - 104);
}

function perforation(ctx, W, H) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let x = 72; x < W - 72; x += 26) {
    ctx.beginPath();
    ctx.arc(x, 34, 5, 0, Math.PI * 2);
    ctx.arc(x, H - 34, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function postcardBack(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = "rgba(50,35,40,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.68, 72);
  ctx.lineTo(W * 0.68, H - 72);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(W * 0.73, 190 + i * 56);
    ctx.lineTo(W - 94, 190 + i * 56);
    ctx.stroke();
  }
  ctx.restore();
}

function field(ctx, label, value, x, y, size) {
  ctx.fillStyle = "rgba(50,35,40,0.52)";
  ctx.font = "600 13px Georgia, serif";
  ctx.fillText(label, x, y - size - 7);
  ctx.fillStyle = "#33242a";
  ctx.font = `700 ${size}px Georgia, serif`;
  ctx.fillText(value, x, y);
}

function wrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, x, y);
}

function wrapCentered(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  lines.push(line);
  lines.forEach((item, i) => ctx.fillText(item, x, y + i * lineHeight));
}

function routeArc(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.72);
  ctx.bezierCurveTo(x + w * 0.2, y - h * 0.34, x + w * 0.74, y + h * 1.24, x + w, y + h * 0.16);
  ctx.stroke();
  ctx.restore();
}

function cloud(ctx, x, y, s) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  for (const [dx, dy, r] of [[0, 8, 0.42], [34, -14, 0.52], [78, 0, 0.48], [114, 16, 0.36]]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, s * r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillRect(x - 16, y + 14, 150, 34);
  ctx.restore();
}

function fish(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.04);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.82, 0);
  ctx.lineTo(-s * 1.5, -s * 0.45);
  ctx.lineTo(-s * 1.28, 0);
  ctx.lineTo(-s * 1.5, s * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function skywhale(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 1.65, s * 0.58, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 1.2, -s * 0.1);
  ctx.lineTo(-s * 1.9, -s * 0.5);
  ctx.lineTo(-s * 1.62, 0);
  ctx.lineTo(-s * 1.9, s * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 0.2, s * 0.35);
  ctx.lineTo(s * 0.62, s * 0.86);
  ctx.lineTo(s * 0.8, s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function clock(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(255,247,220,0.72)";
  ctx.strokeStyle = "rgba(50,35,40,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(50,35,40,0.62)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.56);
  ctx.moveTo(0, 0);
  ctx.lineTo(r * 0.4, r * 0.12);
  ctx.stroke();
  ctx.restore();
}

function baggageTag(ctx, x, y, text) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  ctx.fillStyle = "rgba(255,248,224,0.78)";
  ctx.strokeStyle = "rgba(50,35,40,0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-74, -40);
  ctx.lineTo(48, -40);
  ctx.lineTo(78, -10);
  ctx.lineTo(78, 40);
  ctx.lineTo(-74, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(50,35,40,0.66)";
  ctx.font = "700 16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(text, 2, -4);
  ctx.font = "700 13px Georgia, serif";
  ctx.fillText("MORE TIME", 2, 20);
  ctx.restore();
}

function stamp(ctx, x, y, top, bottom) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  ctx.strokeStyle = "rgba(199,74,92,0.78)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 76, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(199,74,92,0.86)";
  ctx.font = "700 17px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(top, 0, -10);
  ctx.font = "700 15px Georgia, serif";
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

function roundedRect(ctx, x, y, w, h, r) {
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

function chair(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(-48, -28, 96, 42);
  ctx.fillRect(-38, 18, 76, 20);
  ctx.fillRect(-42, 42, 10, 32);
  ctx.fillRect(32, 42, 10, 32);
  ctx.restore();
}

function suitcase(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(50,35,40,0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(-48, -34, 96, 84);
  ctx.fillRect(-48, -34, 96, 84);
  ctx.beginPath();
  ctx.arc(0, -34, 24, Math.PI, 0);
  ctx.stroke();
  ctx.restore();
}

function infinity(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(-28, 0, 30, 22, 0.2, 0, Math.PI * 2);
  ctx.ellipse(28, 0, 30, 22, -0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function tinyPlane(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(64, 0);
  ctx.lineTo(-58, -20);
  ctx.lineTo(-28, 0);
  ctx.lineTo(-58, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
