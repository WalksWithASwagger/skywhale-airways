// The "whale sky god" audio bed plus a WebAudio analyser that feeds a 0..1
// amplitude into the shader. Browsers block autoplay, so playback starts on the
// first user gesture; the toggle lets the visitor mute/unmute thereafter.
export class AudioBed {
  constructor(toggleEl, { src = "/audio/whale-sky-god.mp3" } = {}) {
    this.level = 0;
    this.started = false;
    this.toggle = toggleEl;

    this.el = new Audio(src);
    this.el.loop = true;
    this.el.preload = "auto";
    this.el.crossOrigin = "anonymous";

    this.toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.started ? this.#userToggle() : this.start();
    });
  }

  // Called once on the first page gesture (scroll/click/touch).
  start() {
    if (this.started) return;
    this.started = true;
    this.#connectAnalyser();
    this.#play();
  }

  #connectAnalyser() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
      this.src = this.ctx.createMediaElementSource(this.el);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.bins = new Uint8Array(this.analyser.frequencyBinCount);
      this.src.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    } catch {
      // Analyser unavailable (rare) — audio still plays, visuals idle on audio.
      this.analyser = null;
    }
  }

  async #play() {
    try {
      if (this.ctx?.state === "suspended") await this.ctx.resume();
      await this.el.play();
      this.#setUi(true);
    } catch {
      this.#setUi(false);
    }
  }

  #userToggle() {
    if (this.el.paused) {
      this.#play();
    } else {
      this.el.pause();
      this.#setUi(false);
    }
  }

  #setUi(on) {
    this.toggle.setAttribute("aria-pressed", String(on));
    this.toggle.classList.toggle("on", on);
    this.toggle.setAttribute("aria-label", on ? "Mute soundtrack" : "Play soundtrack");
  }

  // 0..1 smoothed amplitude for the current frame.
  sample() {
    if (!this.analyser || this.el.paused) {
      this.level *= 0.9; // decay to calm when paused
      return this.level;
    }
    this.analyser.getByteFrequencyData(this.bins);
    let sum = 0;
    for (let i = 0; i < this.bins.length; i++) sum += this.bins[i];
    const avg = sum / this.bins.length / 255; // 0..1
    this.level += (avg - this.level) * 0.25;
    return this.level;
  }
}
