import { CanvasArtifact, DECADES, populate, setValue, seed, rng } from "./canvas-kit.js";
import {
  paper, border, perforation, routeArc, fish, clock, baggageTag, field, wrap,
  stamp, barcode,
} from "./canvas-draw.js";

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
