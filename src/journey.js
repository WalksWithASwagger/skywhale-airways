import * as THREE from "three";
import vertSource from "./shaders/transition.vert?raw";
import fragSource from "./shaders/transition.frag?raw";
import { scenes, sceneImage } from "./data/scenes.js";

// Renders the scroll-driven journey: one fullscreen quad whose shader melts
// between adjacent scene textures. Scroll sets `progress` in [0, N-1]; the
// integer part is the current scene, the fraction is the melt into the next.
export class Journey {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.count = scenes.length;
    this.textures = new Array(this.count).fill(null);
    this.loading = new Array(this.count).fill(false);
    this.progress = 0;
    this.targetProgress = 0;
    this.audioLevel = 0;
    this.placeholder = this.#makePlaceholderTexture();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0xe9c6d4, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.targetMouse = new THREE.Vector2(0, 0); // cursor in NDC, -1..1

    this.uniforms = {
      uTexA: { value: this.placeholder },
      uTexB: { value: this.placeholder },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: reducedMotion ? 0.0 : 1.0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCover: { value: new THREE.Vector2(1, 1) },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: vertSource,
        fragmentShader: fragSource,
        uniforms: this.uniforms,
      })
    );
    this.scene.add(mesh);

    this.loader = new THREE.TextureLoader();
    this.timer = new THREE.Timer();

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Eagerly load the first two so the opening melt is ready.
    this.#ensureTexture(0);
    this.#ensureTexture(1);
  }

  #makePlaceholderTexture() {
    const data = new Uint8Array([233, 198, 212, 255]); // dusty rose
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  #ensureTexture(i) {
    if (i < 0 || i >= this.count) return;
    if (this.textures[i] || this.loading[i]) return;
    this.loading[i] = true;
    const small = window.innerWidth < 900;
    this.loader.load(
      sceneImage(scenes[i].slug, small),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        this.textures[i] = tex;
      },
      undefined,
      () => {
        this.loading[i] = false;
      }
    );
  }

  #texAt(i) {
    return this.textures[Math.max(0, Math.min(this.count - 1, i))] || this.placeholder;
  }

  // progress: 0..1 across the whole scroll track.
  setScroll(t) {
    this.targetProgress = THREE.MathUtils.clamp(t, 0, 1) * (this.count - 1);
    const i = Math.round(this.targetProgress);
    this.#ensureTexture(i);
    this.#ensureTexture(i + 1);
    this.#ensureTexture(i - 1);
  }

  setAudioLevel(v) {
    this.audioLevel = v;
  }

  // x,y in normalized device coords (-1..1); the shader eases toward it.
  setMouse(x, y) {
    this.targetMouse.set(x, y);
  }

  currentSceneIndex() {
    return Math.round(this.progress);
  }

  #updateCover() {
    const i = Math.floor(this.progress);
    const tex = this.textures[i];
    const img = tex?.image;
    const imgAspect = img && img.width ? img.width / img.height : 16 / 9;
    const viewAspect = this.width / this.height;
    if (imgAspect > viewAspect) {
      this.uniforms.uCover.value.set(viewAspect / imgAspect, 1);
    } else {
      this.uniforms.uCover.value.set(1, imgAspect / viewAspect);
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height, false);
    this.uniforms.uResolution.value.set(this.width, this.height);
  }

  render() {
    // Timer must be advanced once per frame before reading the delta.
    this.timer.update();
    const dt = this.timer.getDelta();
    // Ease scroll so melts stay liquid — a gentle constant lets the melt keep
    // flowing after you stop scrolling, instead of snapping to the new scene.
    const ease = this.reducedMotion ? 1 : 1 - Math.pow(0.08, dt);
    this.progress += (this.targetProgress - this.progress) * ease;

    // Smooth the audio level for a breathing, not jittery, reaction.
    this.uniforms.uAudio.value +=
      (this.audioLevel - this.uniforms.uAudio.value) * Math.min(1, dt * 6);

    // Trail the cursor so subtle mouse moves ripple the image with a soft lag.
    const m = this.uniforms.uMouse.value;
    const mk = Math.min(1, dt * 3);
    m.x += (this.targetMouse.x - m.x) * mk;
    m.y += (this.targetMouse.y - m.y) * mk;

    const i = Math.floor(this.progress);
    const frac = this.progress - i;
    this.uniforms.uTexA.value = this.#texAt(i);
    this.uniforms.uTexB.value = this.#texAt(i + 1);
    this.uniforms.uProgress.value = frac;
    this.uniforms.uTime.value += dt;
    this.#updateCover();

    this.renderer.render(this.scene, this.camera);
  }
}
