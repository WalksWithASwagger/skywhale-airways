import { DECADES, populate, setValue, seed, rng } from "./artifacts/canvas-kit.js";

const MOODS = [
  {
    value: "arriving",
    label: "Arriving",
    stamp: "ARRIVED NOWHEN",
    detail: "PORTAL ENTRY RECORDED",
  },
  {
    value: "delayed",
    label: "Delayed",
    stamp: "DELAYED BY GRAVITY",
    detail: "RUNWAY STILL DREAMING",
  },
  {
    value: "cleared",
    label: "Cleared",
    stamp: "CLEARED THROUGH MEMORY",
    detail: "CROSSING AUTHORIZED",
  },
  {
    value: "circling",
    label: "Circling",
    stamp: "CIRCLING ALL DECADES",
    detail: "HOLDING PATTERN ACTIVE",
  },
  {
    value: "remembering",
    label: "Remembering",
    stamp: "REMEMBERING TOMORROW",
    detail: "MEMORY VISA VALID",
  },
];

const ROUTES = [
  { value: "memory", label: "Through Memory", stamp: "THROUGH MEMORY" },
  { value: "golden", label: "Via Golden Fish", stamp: "VIA GOLDEN FISH" },
  { value: "baggage", label: "Past Lost Baggage", stamp: "PAST LOST BAGGAGE" },
  { value: "skywhale", label: "Under the Skywhale", stamp: "UNDER THE SKYWHALE" },
  { value: "infinity", label: "Gate Infinity", stamp: "GATE INFINITY" },
];

export class PassportStamp {
  constructor({ form, decadeSelect, moodSelect, routeSelect, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    this.form = form;
    this.decadeSelect = decadeSelect;
    this.moodSelect = moodSelect;
    this.routeSelect = routeSelect;
    this.stage = stage;
    this.canvas = canvas;
    this.downloadBtn = downloadBtn;
    this.copyBtn = copyBtn;
    this.shareBtn = shareBtn;
    this.ctx = canvas.getContext("2d");

    populate(this.decadeSelect, DECADES.map((d) => ({ value: d, label: d })));
    populate(this.moodSelect, MOODS);
    populate(this.routeSelect, ROUTES);
    this.decadeSelect.value = "1970s";
    this.moodSelect.value = "cleared";
    this.routeSelect.value = "memory";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.issue();
    });
    this.downloadBtn.addEventListener("click", () => this.#download());
    if (this.copyBtn && navigator.clipboard?.writeText) {
      this.copyBtn.hidden = false;
      this.copyBtn.addEventListener("click", () => this.#copyLink());
    }
    if ("share" in navigator && "canShare" in navigator) {
      this.shareBtn.hidden = false;
      this.shareBtn.addEventListener("click", () => this.#share());
    }
  }

  issueFromLink({ decade, mood, route }) {
    setValue(this.decadeSelect, decade);
    setValue(this.moodSelect, mood);
    setValue(this.routeSelect, route);
    this.issue();
  }

  issue() {
    this.data = this.#details();
    this.#draw(this.data);
    this.stage.hidden = false;
    this.stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  #details() {
    const mood = MOODS.find((item) => item.value === this.moodSelect.value) || MOODS[0];
    const route = ROUTES.find((item) => item.value === this.routeSelect.value) || ROUTES[0];
    const decade = this.decadeSelect.value;
    const seq = String(seed(`${decade}${mood.value}${route.value}`) % 10000).padStart(4, "0");
    return { decade, mood, route, seq };
  }

  #draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${d.decade}${d.mood.value}${d.route.value}`);
    ctx.clearRect(0, 0, W, H);

    const paper = ctx.createLinearGradient(0, 0, W, H);
    paper.addColorStop(0, "#f9ead6");
    paper.addColorStop(0.52, "#f4d9e3");
    paper.addColorStop(1, "#cfd9ec");
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(55,40,42,${rand() * 0.04})`;
      ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
    }

    this.#perforation(ctx, W, H);
    this.#routeArc(ctx, 86, 152, 840, 110);
    this.#skywhale(ctx, 138, 116, 66, "rgba(194,135,46,0.78)");
    this.#fish(ctx, 802, 126, 26, "rgba(53,94,103,0.62)");
    this.#fish(ctx, 852, 164, 18, "rgba(199,74,92,0.5)");
    this.#clock(ctx, 812, 486, 58);
    this.#baggageTag(ctx, 136, 454);

    ctx.strokeStyle = "rgba(50,35,40,0.54)";
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.strokeStyle = "rgba(53,94,103,0.42)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    ctx.fillStyle = "#33242a";
    ctx.textBaseline = "alphabetic";
    ctx.font = "700 32px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 76, 96);
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.68)";
    ctx.fillText("Gate Infinity Passport Control", 76, 126);

    this.#stamp(ctx, d, W * 0.52, H * 0.49);
    this.#cancellation(ctx, 122, 292, 265);
    this.#cancellation(ctx, 646, 348, 242);

    this.#field(ctx, "ARRIVING", d.decade, 302, 486, 34);
    this.#field(ctx, "MOOD", d.mood.label.toUpperCase(), 492, 486, 25);
    this.#field(ctx, "ROUTE", d.route.label.toUpperCase(), 302, 562, 23);
    this.#field(ctx, "SEQ", d.seq, 758, 562, 23);

    ctx.save();
    ctx.translate(826, 252);
    ctx.rotate(0.1);
    ctx.strokeStyle = "rgba(199,74,92,0.68)";
    ctx.lineWidth = 3;
    ctx.strokeRect(-70, -40, 140, 80);
    ctx.fillStyle = "rgba(199,74,92,0.78)";
    ctx.font = "700 18px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("VISA", 0, -8);
    ctx.font = "700 30px Georgia, serif";
    ctx.fillText("GATE ∞", 0, 24);
    ctx.restore();
  }

  #stamp(ctx, d, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.08);

    ctx.strokeStyle = "rgba(199,74,92,0.82)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 250, 150, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 222, 124, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(199,74,92,0.88)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 24px Georgia, serif";
    ctx.fillText("GATE INFINITY", 0, -92);
    ctx.font = "700 33px Georgia, serif";
    this.#centerLines(ctx, d.mood.stamp, 0, -16, 310, 38);
    ctx.font = "700 20px Georgia, serif";
    ctx.fillText(d.route.stamp, 0, 58);
    ctx.font = "700 16px Georgia, serif";
    ctx.fillText(d.mood.detail, 0, 90);
    ctx.restore();
  }

  #centerLines(ctx, text, x, y, maxWidth, lineHeight) {
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
    const top = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((item, i) => ctx.fillText(item, x, top + i * lineHeight));
  }

  #field(ctx, label, value, x, y, size) {
    ctx.fillStyle = "rgba(50,35,40,0.5)";
    ctx.font = "600 13px Georgia, serif";
    ctx.fillText(label, x, y - size - 7);
    ctx.fillStyle = "#33242a";
    ctx.font = `700 ${size}px Georgia, serif`;
    ctx.fillText(value, x, y);
  }

  #cancellation(ctx, x, y, w) {
    ctx.save();
    ctx.strokeStyle = "rgba(53,94,103,0.44)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + i * 18);
      ctx.lineTo(x + w, y + i * 18 - 14);
      ctx.stroke();
    }
    ctx.restore();
  }

  #routeArc(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(53,94,103,0.34)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 11]);
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.75);
    ctx.bezierCurveTo(x + w * 0.18, y - h * 0.35, x + w * 0.76, y + h * 1.2, x + w, y + h * 0.08);
    ctx.stroke();
    ctx.restore();
  }

  #perforation(ctx, W, H) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    for (let x = 72; x < W - 72; x += 26) {
      ctx.beginPath();
      ctx.arc(x, 34, 5, 0, Math.PI * 2);
      ctx.arc(x, H - 34, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let y = 72; y < H - 72; y += 26) {
      ctx.beginPath();
      ctx.arc(34, y, 5, 0, Math.PI * 2);
      ctx.arc(W - 34, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  #fish(ctx, x, y, s, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.05);
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

  #skywhale(ctx, x, y, s, color) {
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

  #clock(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255,247,220,0.7)";
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

  #baggageTag(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.08);
    ctx.fillStyle = "rgba(255,248,224,0.78)";
    ctx.strokeStyle = "rgba(50,35,40,0.42)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-72, -40);
    ctx.lineTo(46, -40);
    ctx.lineTo(76, -10);
    ctx.lineTo(76, 40);
    ctx.lineTo(-72, 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(50,35,40,0.66)";
    ctx.font = "700 16px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("ONE BAG", 2, -4);
    ctx.font = "700 13px Georgia, serif";
    ctx.fillText("MORE TIME", 2, 20);
    ctx.restore();
  }

  #filename() {
    const decade = this.data?.decade || this.decadeSelect.value;
    const mood = this.data?.mood.value || this.moodSelect.value;
    return `skywhale-passport-stamp-${decade}-${mood}.png`;
  }

  #shareUrl() {
    const data = this.data || this.#details();
    const params = new URLSearchParams({
      decade: data.decade,
      mood: data.mood.value,
      route: data.route.value,
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `stamp?${params.toString()}`;
    return url.toString();
  }

  #download() {
    const a = document.createElement("a");
    a.download = this.#filename();
    a.href = this.canvas.toDataURL("image/png");
    a.click();
  }

  async #copyLink() {
    try {
      await navigator.clipboard.writeText(this.#shareUrl());
      this.#flashCopyStatus("Copied");
    } catch {
      this.#flashCopyStatus("Copy failed");
    }
  }

  #flashCopyStatus(text) {
    this.copyBtn.textContent = text;
    clearTimeout(this.copyReset);
    this.copyReset = window.setTimeout(() => {
      this.copyBtn.textContent = "Copy link";
    }, 1400);
  }

  async #share() {
    try {
      const blob = await new Promise((res) => this.canvas.toBlob(res, "image/png"));
      const file = new File([blob], this.#filename(), { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Gate Infinity passport stamp",
          text: "Stamped at Gate Infinity by Skywhale Airways.",
        });
      }
    } catch {
      // share dismissed
    }
  }

}
