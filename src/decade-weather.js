import { CanvasArtifact, DECADES, populate, setValue, rng } from "./canvas/canvas-kit.js";

const REPORTS = {
  "1920s": {
    condition: "Rose fog with brass propeller gusts",
    visibility: "Two gates, then a trumpet solo",
    delay: "Runway waiting for the moon to taxi",
    baggage: "Label memories in pencil; ink may arrive first",
    line: "The decade smells like rain on velvet luggage.",
  },
  "1930s": {
    condition: "Low clouds, high hatboxes, steady reel hiss",
    visibility: "Fair beyond Gate 7, uncertain near tomorrow",
    delay: "Clock hands rehearsing a softer disaster",
    baggage: "Keep receipts for every borrowed minute",
    line: "A gold fish crosses the tarmac and all umbrellas bow.",
  },
  "1940s": {
    condition: "Static showers over the departures lounge",
    visibility: "Clear if you look sideways",
    delay: "Fish traffic circling under blackout curtains",
    baggage: "One suitcase permitted; grief counts as carry-on",
    line: "Every announcement arrives wearing someone else's coat.",
  },
  "1950s": {
    condition: "Chrome sunbreaks with diner-window shimmer",
    visibility: "Excellent until the jukebox changes gates",
    delay: "Runway polishing itself for a memory",
    baggage: "Pack sunglasses and a spare yesterday",
    line: "The clouds are clean, pink, and suspiciously organized.",
  },
  "1960s": {
    condition: "Psychedelic crosswinds and soft clock melt",
    visibility: "Kaleidoscopic, with brief fish silhouettes",
    delay: "Gate infinity has misplaced its floor",
    baggage: "Do not check your duplicate self",
    line: "Weather blooms from the loudspeaker in dusty rose.",
  },
  "1970s": {
    condition: "Warm analog haze under a yellow skywhale",
    visibility: "Beautifully strange; runway visible in dreams",
    delay: "Good pilots never ask where you are going",
    baggage: "Bring one bag and more time than you left with",
    line: "Every decade has its own weather; this one has fins.",
  },
  "1980s": {
    condition: "Electric drizzle and split-flap thunder",
    visibility: "Neon low, terminal pink, clocks unreliable",
    delay: "A cassette of wrong minutes is rewinding",
    baggage: "Mark fragile items as future evidence",
    line: "The tarmac glows like a screensaver remembering the sea.",
  },
  "1990s": {
    condition: "Overcast modem tones with cloud-orchard breaks",
    visibility: "Patchy near the snack machines",
    delay: "The arrivals board is buffering its feelings",
    baggage: "Zip pockets; loose years may fall out",
    line: "A small plane writes your name in dial-up weather.",
  },
  "2000s": {
    condition: "Silver rain, terminal glass, fish in formation",
    visibility: "Good, except around old passwords",
    delay: "Security scanning a suitcase full of almosts",
    baggage: "Keep nostalgia under the seat in front of you",
    line: "The sky refreshes and nothing quite reloads the same.",
  },
  "2010s": {
    condition: "Blue-app glare with intermittent cloud confetti",
    visibility: "High resolution, emotionally pixelated",
    delay: "The route map is asking for permission",
    baggage: "Airplane mode recommended for unresolved timelines",
    line: "A fish notification crosses the sky and refuses to clear.",
  },
  "2020s": {
    condition: "Soft apocalypse light with hopeful tailwinds",
    visibility: "Variable, improving near the pink rotunda",
    delay: "Runway opens like a memory after turbulence",
    baggage: "Carry water, patience, and a duplicate boarding pass",
    line: "The weather is weird, but the skywhale is still boarding.",
  },
};

export class DecadeWeather extends CanvasArtifact {
  constructor({ form, decadeSelect, stage, canvas, downloadBtn, copyBtn, shareBtn }) {
    super({ stage, canvas, downloadBtn, copyBtn, shareBtn });
    this.form = form;
    this.decadeSelect = decadeSelect;

    populate(this.decadeSelect, DECADES.map((d) => ({ value: d, label: d })));
    this.decadeSelect.value = "1970s";

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.issue();
    });
  }

  issueFromLink({ decade }) {
    setValue(this.decadeSelect, decade);
    this.issue();
  }

  issue() {
    const decade = this.decadeSelect.value;
    this.data = { decade, ...REPORTS[decade] };
    this.#draw(this.data);
    this.reveal();
  }

  #draw(d) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rand = rng(d.decade);
    ctx.clearRect(0, 0, W, H);

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#fbecd7");
    g.addColorStop(0.48, "#f4d9e3");
    g.addColorStop(1, "#c9dced");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(70,45,50,${rand() * 0.035})`;
      ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
    }

    ctx.strokeStyle = "rgba(50,35,40,0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.strokeStyle = "rgba(53,94,103,0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    this.#route(ctx, 154, 170, 700, 102);
    this.#cloud(ctx, 710, 126, 74);
    this.#cloud(ctx, 122, 218, 54);
    this.#skywhale(ctx, 516, 112, 46);
    for (let i = 0; i < 6; i++) {
      this.#fish(ctx, 222 + i * 96, 178 + Math.sin(i) * 22, 16 + (i % 3) * 5);
    }

    ctx.fillStyle = "#33242a";
    ctx.textBaseline = "alphabetic";
    ctx.font = "700 28px Georgia, 'Times New Roman', serif";
    ctx.fillText("SKYWHALE AIRWAYS", 70, 92);
    ctx.font = "700 44px Georgia, serif";
    ctx.fillStyle = "rgba(199,74,92,0.82)";
    ctx.fillText("DECADE WEATHER", 70, 148);
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillStyle = "rgba(50,35,40,0.7)";
    ctx.fillText("Every decade has its own weather", 72, 178);

    ctx.fillStyle = "rgba(53,94,103,0.76)";
    ctx.fillRect(70, 198, 210, 62);
    ctx.fillStyle = "#fff";
    ctx.font = "700 44px Georgia, serif";
    ctx.fillText(d.decade, 94, 243);

    this.#panel(ctx, "CONDITION", d.condition, 70, 292, 420, 96);
    this.#panel(ctx, "RUNWAY VISIBILITY", d.visibility, 534, 292, 420, 96);
    this.#panel(ctx, "DELAY REASON", d.delay, 70, 414, 420, 96);
    this.#panel(ctx, "BAGGAGE ADVISORY", d.baggage, 534, 414, 420, 96);

    ctx.fillStyle = "rgba(50,35,40,0.76)";
    ctx.font = "italic 23px Georgia, serif";
    this.#wrap(ctx, d.line, 70, H - 70, 710, 29);

    this.#clock(ctx, 866, 212, 52);
    this.#stamp(ctx, W - 140, H - 78);
  }

  #panel(ctx, label, value, x, y, w, h) {
    ctx.fillStyle = "rgba(255,251,240,0.62)";
    ctx.strokeStyle = "rgba(50,35,40,0.24)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "rgba(199,74,92,0.74)";
    ctx.font = "700 13px Georgia, serif";
    ctx.fillText(label, x + 20, y + 28);
    ctx.fillStyle = "#33242a";
    ctx.font = "700 22px Georgia, serif";
    this.#wrap(ctx, value, x + 20, y + 64, w - 40, 27);
  }

  // eslint-disable-next-line no-unused-private-class-members -- kept for an upcoming weather-card field layout
  #field(ctx, label, value, x, y, size, maxWidth) {
    ctx.fillStyle = "rgba(50,35,40,0.55)";
    ctx.font = "600 13px Georgia, serif";
    ctx.fillText(label, x, y - size - 8);
    ctx.fillStyle = "#33242a";
    ctx.font = `700 ${size}px Georgia, serif`;
    this.#wrap(ctx, value, x, y, maxWidth, size + 7);
  }

  #wrap(ctx, text, x, y, maxWidth, lineHeight) {
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

  #route(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(50,35,40,0.28)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.75);
    ctx.bezierCurveTo(x + w * 0.22, y - h * 0.45, x + w * 0.7, y + h * 1.35, x + w, y + h * 0.2);
    ctx.stroke();
    ctx.restore();
  }

  #cloud(ctx, x, y, s) {
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

  #fish(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(x * 0.02) * 0.14);
    ctx.fillStyle = "rgba(242,193,78,0.44)";
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.8, 0);
    ctx.lineTo(-s * 1.45, -s * 0.46);
    ctx.lineTo(-s * 1.25, 0);
    ctx.lineTo(-s * 1.45, s * 0.46);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  #skywhale(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(194,135,46,0.72)";
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

  #clock(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255,248,224,0.72)";
    ctx.strokeStyle = "rgba(50,35,40,0.42)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(50,35,40,0.62)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.08, -r * 0.62);
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.44, r * 0.18);
    ctx.stroke();
    ctx.fillStyle = "rgba(50,35,40,0.58)";
    ctx.font = "700 10px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("WRONG", 0, r + 18);
    ctx.restore();
  }

  #stamp(ctx, x, y) {
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
    ctx.font = "700 18px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("GATE INFINITY", 0, -10);
    ctx.font = "700 15px Georgia, serif";
    ctx.fillText("WEATHER", 0, 18);
    ctx.restore();
  }

  filename() {
    return `skywhale-weather-${this.data?.decade || "1970s"}.png`;
  }

  shareUrl() {
    const decade = this.data?.decade || this.decadeSelect.value;
    const params = new URLSearchParams({ decade });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `weather?${params.toString()}`;
    return url.toString();
  }

  shareTitle() {
    return "My Skywhale Airways decade weather";
  }

  shareText() {
    return "Every decade has its own weather.";
  }
}
