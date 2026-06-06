// Shared kit for every canvas widget on the site — the boarding pass, decade
// weather, and passport stamp, plus the Gate Infinity terminal artifacts (gate
// receipt, route postcard, suitcase manifest). Provides the CanvasArtifact base
// class that handles download / copy-link / file-share, plus the small form +
// seeded-RNG helpers they share. Pure pixel-drawing primitives live in
// ./canvas-draw.js.

export const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

export class CanvasArtifact {
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

export function populate(select, options) {
  for (const option of options) {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  }
}

export function setValue(select, value) {
  if ([...select.options].some((option) => option.value === value)) select.value = value;
}

export function seed(text) {
  return [...text].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

export function rng(text) {
  let n = seed(text);
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
