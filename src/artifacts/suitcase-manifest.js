import { CanvasArtifact, DECADES, populate, setValue, seed, rng } from "../canvas/canvas-kit.js";
import {
  paper, border, perforation, routeArc, skywhale, baggageTag, field, wrapCentered,
  roundedRect, fish, clock, cloud, chair, suitcase, infinity, tinyPlane,
} from "../canvas/canvas-draw.js";

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
