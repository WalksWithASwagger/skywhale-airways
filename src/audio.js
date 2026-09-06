// The "whale sky god" audio bed plus a WebAudio analyser that feeds a 0..1
// amplitude into the shader. Browsers block autoplay, so playback starts on the
// first user gesture; the toggle lets the visitor mute/unmute thereafter.
export class AudioBed {
  constructor(
    toggleEl,
    {
      src = `${import.meta.env.BASE_URL}audio/whale-sky-god.mp3`,
      beforePlay = () => true,
    } = {}
  ) {
    this.level = 0;
    this.started = false;
    this.wantsPlay = false;
    this.request = 0;
    this.allowedRequest = 0;
    this.beforePlay = beforePlay;
    this.toggle = toggleEl;

    this.el = new Audio(src);
    this.el.loop = true;
    this.el.preload = "none";
    this.el.crossOrigin = "anonymous";

    this.toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.wantsPlay) this.pause();
      else void this.start();
    });
  }

  async start() {
    const request = ++this.request;
    this.wantsPlay = true;
    if (!this.started) {
      this.started = true;
      this.#connectAnalyser();
    }
    try {
      const resumed =
        this.ctx?.state === "suspended" ? this.ctx.resume() : Promise.resolve();
      const [allowed] = await Promise.all([this.beforePlay(), resumed]);
      if (request !== this.request) return;
      if (!allowed) {
        this.pause();
        return;
      }
      this.allowedRequest = request;
      await this.el.play();
      if (this.allowedRequest !== this.request) this.el.pause();
      if (request === this.request) this.#setUi(this.wantsPlay);
    } catch {
      if (request === this.request) this.pause();
    }
  }

  pause() {
    this.request++;
    this.wantsPlay = false;
    this.el.pause();
    this.#setUi(false);
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

  #setUi(on) {
    this.toggle.setAttribute("aria-pressed", String(on));
    this.toggle.classList.toggle("on", on);
    this.toggle.setAttribute(
      "aria-label",
      on ? "Mute soundtrack" : "Play soundtrack"
    );
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
