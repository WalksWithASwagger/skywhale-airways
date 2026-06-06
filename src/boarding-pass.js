// The signature widget: a visitor names themselves and picks a decade, and the
// airport issues a psychedelic time-travel boarding pass on a <canvas> they can
// download or share. Fully client-side — no backend.

import { DECADES, populate, setValue, rng } from "./artifacts/canvas-kit.js";

const STATUSES = [
  "BOARDING THROUGH MEMORY",
  "DELAYED BY GRAVITY",
  "NOW BOARDING · ALL DECADES",
  "CIRCLING · AWAITING WEATHER",
  "GATE OPEN · MIND THE CLOCK",
  "FINAL CALL · BENEATH THE SKYWHALE",
];

const TERMINALS = ["WHALE", "ORCHID", "TIDE", "EMBER", "DRIFT"];

export class BoardingPass {
  constructor({ form, nameInput, decadeSelect, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    this.form = form;
    this.nameInput = nameInput;
    this.decadeSelect = decadeSelect;
    this.stage = stage;
    this.canvas = canvas;
    this.downloadBtn = downloadBtn;
    this.copyBtn = copyBtn;
    this.shareBtn = shareBtn;
    this.ctx = canvas.getContext("2d");

    populate(this.decadeSelect, DECADES.map((d) => ({ value: d, label: d })));
    this.decadeSelect.value = "1970s";

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

  issueFromLink({ name, decade }) {
    this.nameInput.value = (name || "").trim().slice(0, 22);
    setValue(this.decadeSelect, decade);
    this.issue();
  }

  // Deterministic-ish flourishes from the inputs so a pass is stable per name.
  #flourishes() {
    const name = (this.nameInput.value || "Traveler").trim().slice(0, 22);
    const decade = this.decadeSelect.value;
    const seed = [...(name + decade)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const gate = seed % 4 === 0 ? "∞" : String((seed % 30) + 1);
    const status = STATUSES[seed % STATUSES.length];
    const terminal = TERMINALS[seed % TERMINALS.length];
    const flight = "SW-" + (100 + (seed % 899));
    const seq = String((seed * 7) % 1000).padStart(3, "0");
    return { name, decade, gate, status, terminal, flight, seq };
  }

  issue() {
    this.data = this.#flourishes();
    this.#draw(this.data);
    this.stage.hidden = false;
    this.stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  #draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(`${d.name}${d.decade}${d.flight}`);
    ctx.clearRect(0, 0, W, H);

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#f9ead6");
    g.addColorStop(0.44, "#f4d9e3");
    g.addColorStop(1, "#cfd9ec");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 1600; i++) {
      ctx.fillStyle = `rgba(80,60,70,${rand() * 0.04})`;
      ctx.fillRect(rand() * W, rand() * H, 1.5, 1.5);
    }

    this.#route(ctx, 74, 142, 830, 95);
    this.#perforation(ctx, W, H);
    this.#skywhale(ctx, W - 180, 108, 44);
    this.#baggageSticker(ctx, 86, H - 116);
    for (let i = 0; i < 8; i++) {
      this.#fish(ctx, 110 + i * 92, 142 + Math.sin(i * 1.6) * 36, 16 + (i % 3) * 6, `rgba(242,193,78,${0.28 + rand() * 0.26})`);
    }

    ctx.strokeStyle = "rgba(50,35,40,0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.strokeStyle = "rgba(53,94,103,0.34)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 44, W - 88, H - 88);

    const stubX = W * 0.7;
    ctx.setLineDash([3, 10]);
    ctx.beginPath();
    ctx.moveTo(stubX, 36);
    ctx.lineTo(stubX, H - 36);
    ctx.stroke();
    ctx.setLineDash([]);

    const ink = "#33242a";
    ctx.fillStyle = ink;
    ctx.textBaseline = "alphabetic";

    ctx.font = "700 30px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 56, 84);
    ctx.font = "italic 17px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.7)";
    ctx.fillText("A Psychedelic Airport for Time Travelers", 56, 110);

    this.#field(ctx, "PASSENGER", d.name.toUpperCase() || "TRAVELER", 56, 180, 30);
    this.#field(ctx, "DEPARTING", "NOW", 56, 260, 26);
    this.#field(ctx, "ARRIVING", d.decade, 300, 260, 26);
    this.#field(ctx, "TERMINAL", d.terminal, 56, 340, 24);
    this.#field(ctx, "FLIGHT", d.flight, 300, 340, 24);

    // Status banner.
    ctx.fillStyle = "rgba(199,74,92,0.92)";
    ctx.fillRect(56, 372, stubX - 100, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "700 18px Georgia, serif";
    ctx.fillText(d.status, 70, 399);

    this.#stamp(ctx, stubX - 130, H - 150);

    ctx.fillStyle = "rgba(50,35,40,0.6)";
    ctx.font = "14px Georgia, serif";
    ctx.fillText("Carry one bag. Bring more time than you leave with.", 56, H - 56);

    const sx = stubX + 26;
    this.#field(ctx, "GATE", d.gate, sx, 180, 40);
    this.#field(ctx, "SEAT", "FISH", sx, 270, 30);
    this.#field(ctx, "SEQ", d.seq, sx, 350, 26);
    this.#stamp(ctx, sx + 96, 126);

    ctx.fillStyle = ink;
    let bx = sx;
    for (let i = 0; i < 26 && bx < W - 44; i++) {
      const w = 2 + Math.round(rand() * 5);
      ctx.fillRect(bx, H - 130, w, 70);
      bx += w + 2 + Math.round(rand() * 3);
    }
  }

  #field(ctx, label, value, x, y, size) {
    ctx.fillStyle = "rgba(50,35,40,0.55)";
    ctx.font = "600 13px Georgia, serif";
    ctx.fillText(label, x, y - size - 4);
    ctx.fillStyle = "#33242a";
    ctx.font = `700 ${size}px Georgia, serif`;
    ctx.fillText(value, x, y);
  }

  #route(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(53,94,103,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.65);
    ctx.bezierCurveTo(x + w * 0.22, y - h * 0.36, x + w * 0.72, y + h * 1.22, x + w, y + h * 0.16);
    ctx.stroke();
    ctx.restore();
  }

  #perforation(ctx, W, H) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    for (let x = 76; x < W - 76; x += 28) {
      ctx.beginPath();
      ctx.arc(x, 28, 5, 0, Math.PI * 2);
      ctx.arc(x, H - 28, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  #fish(ctx, x, y, s, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(x * 0.015) * 0.18);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.8, 0);
    ctx.lineTo(-s * 1.5, -s * 0.5);
    ctx.lineTo(-s * 1.3, 0);
    ctx.lineTo(-s * 1.5, s * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  #skywhale(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(194,135,46,0.7)";
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.7, s * 0.58, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 1.18, -s * 0.08);
    ctx.lineTo(-s * 1.88, -s * 0.5);
    ctx.lineTo(-s * 1.6, 0);
    ctx.lineTo(-s * 1.88, s * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  #baggageSticker(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.08);
    ctx.fillStyle = "rgba(255,248,224,0.72)";
    ctx.strokeStyle = "rgba(50,35,40,0.34)";
    ctx.lineWidth = 3;
    ctx.fillRect(0, 0, 132, 72);
    ctx.strokeRect(0, 0, 132, 72);
    ctx.fillStyle = "rgba(53,94,103,0.72)";
    ctx.font = "700 15px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("BAGGAGE", 66, 30);
    ctx.fillStyle = "rgba(199,74,92,0.75)";
    ctx.fillText("MEMORY", 66, 52);
    ctx.restore();
  }

  #stamp(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.15);
    ctx.strokeStyle = "rgba(199,74,92,0.68)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(199,74,92,0.76)";
    ctx.font = "700 13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("GATE", 0, -8);
    ctx.font = "700 25px Georgia, serif";
    ctx.fillText("∞", 0, 18);
    ctx.restore();
  }

  #filename() {
    const slug = (this.data?.name || "traveler").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "traveler";
    return `time-airways-${slug}-${this.data?.decade || "pass"}.png`;
  }

  #download() {
    const a = document.createElement("a");
    a.download = this.#filename();
    a.href = this.canvas.toDataURL("image/png");
    a.click();
  }

  #shareUrl() {
    const data = this.data || this.#flourishes();
    const params = new URLSearchParams({ name: data.name, decade: data.decade });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `pass?${params.toString()}`;
    return url.toString();
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
          title: "My time-travel boarding pass",
          text: "Boarding through memory at A Psychedelic Airport for Time Travelers.",
        });
      }
    } catch {
      // share dismissed — no-op
    }
  }

}
