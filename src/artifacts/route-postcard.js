import { CanvasArtifact, DECADES, populate, setValue, seed, rng } from "../canvas/canvas-kit.js";
import { paper, border, postcardBack, cloud, skywhale, fish, field } from "../canvas/canvas-draw.js";

const ROUTE_MOODS = [
  { value: "orchard", label: "Cloud orchard", line: "Layover fruit ripening above the runway" },
  { value: "neon", label: "Neon drift", line: "Terminal lights humming in future blue" },
  { value: "pink", label: "Pink rotunda", line: "Arrival hall breathing rose-colored time" },
  { value: "golden", label: "Golden fish", line: "A good pilot with fins and no questions" },
  { value: "memory", label: "Memory runway", line: "The runway opens like a memory" },
];

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
