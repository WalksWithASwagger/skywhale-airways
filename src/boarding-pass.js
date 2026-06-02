// The signature widget: a visitor names themselves and picks a decade, and the
// airport issues a psychedelic time-travel boarding pass on a <canvas> they can
// download or share. Fully client-side — no backend.

const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

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
  constructor({ form, nameInput, decadeSelect, stage, canvas, downloadBtn, shareBtn }) {
    this.form = form;
    this.nameInput = nameInput;
    this.decadeSelect = decadeSelect;
    this.stage = stage;
    this.canvas = canvas;
    this.downloadBtn = downloadBtn;
    this.shareBtn = shareBtn;
    this.ctx = canvas.getContext("2d");

    for (const d of DECADES) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      this.decadeSelect.appendChild(opt);
    }
    this.decadeSelect.value = "1970s";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#issue();
    });
    this.downloadBtn.addEventListener("click", () => this.#download());
    if ("share" in navigator && "canShare" in navigator) {
      this.shareBtn.hidden = false;
      this.shareBtn.addEventListener("click", () => this.#share());
    }
  }

  // Deterministic-ish flourishes from the inputs so a pass is stable per name.
  #flourishes() {
    const name = (this.nameInput.value || "Traveler").trim().slice(0, 22);
    const decade = this.decadeSelect.value;
    const seed = [...(name + decade)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const gate = seed % 4 === 0 ? "∞" : String((seed % 30) + 1);
    const status = STATUSES[seed % STATUSES.length];
    const terminal = TERMINALS[seed % TERMINALS.length];
    const flight = "TA-" + (100 + (seed % 899));
    const seq = String((seed * 7) % 1000).padStart(3, "0");
    return { name, decade, gate, status, terminal, flight, seq };
  }

  #issue() {
    this.data = this.#flourishes();
    this.#draw(this.data);
    this.stage.hidden = false;
    this.stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  #draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Painterly pastel ground.
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#f4d9e3");
    g.addColorStop(0.5, "#e7c7dd");
    g.addColorStop(1, "#cfd9ec");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Grain speckle.
    ctx.save();
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(80,60,70,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
    }
    ctx.restore();

    // Drifting fish marks.
    for (let i = 0; i < 7; i++) this.#fish(ctx, Math.random() * W, Math.random() * H * 0.5, 18 + Math.random() * 22, `rgba(242,193,78,${0.25 + Math.random() * 0.3})`);

    // Ink frame.
    ctx.strokeStyle = "rgba(50,35,40,0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    // Perforated stub divider.
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
    ctx.fillText("TIME AIRWAYS", 56, 84);
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

    ctx.fillStyle = "rgba(50,35,40,0.6)";
    ctx.font = "14px Georgia, serif";
    ctx.fillText("Carry one bag. Bring more time than you leave with.", 56, H - 56);

    // Stub.
    const sx = stubX + 26;
    this.#field(ctx, "GATE", d.gate, sx, 180, 40);
    this.#field(ctx, "SEAT", "🐟", sx, 270, 36);
    this.#field(ctx, "SEQ", d.seq, sx, 350, 26);

    // Faux barcode.
    ctx.fillStyle = ink;
    let bx = sx;
    for (let i = 0; i < 26 && bx < W - 44; i++) {
      const w = 2 + Math.round(Math.random() * 5);
      ctx.fillRect(bx, H - 130, w, 70);
      bx += w + 2 + Math.round(Math.random() * 3);
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

  #fish(ctx, x, y, s, color) {
    ctx.save();
    ctx.translate(x, y);
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
