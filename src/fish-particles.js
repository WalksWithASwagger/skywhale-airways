import * as THREE from "three";

// A drift of fish-aircraft over the journey. Rendered as THREE.Points in the
// journey's own scene (depthTest off, drawn on top), so it shares one render
// pass. Fish glide across in parallax with scroll and pulse with the audio.
export class Fish {
  constructor(scene, { count = 36, reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.count = reducedMotion ? Math.round(count * 0.5) : count;

    this.x = new Float32Array(this.count);
    this.y = new Float32Array(this.count);
    this.speed = new Float32Array(this.count);
    this.depth = new Float32Array(this.count); // 0..1 parallax depth
    this.phase = new Float32Array(this.count);
    this.baseSize = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.x[i] = rand(-1.3, 1.3);
      this.y[i] = rand(-1.0, 1.0);
      this.depth[i] = rand(0.15, 1.0);
      this.speed[i] = rand(0.01, 0.05) * (0.4 + this.depth[i]);
      this.phase[i] = rand(0, Math.PI * 2);
      this.baseSize[i] = rand(10, 34) * (0.5 + this.depth[i]);
    }

    const geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.count * 3);
    this.sizes = new Float32Array(this.count);
    geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(this.sizes, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { uMap: { value: makeFishTexture() } },
      vertexShader: /* glsl */ `
        attribute float size;
        void main() {
          gl_PointSize = size;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D uMap;
        void main() {
          vec4 c = texture2D(uMap, gl_PointCoord);
          if (c.a < 0.02) discard;
          gl_FragColor = c;
        }
      `,
    });

    this.mesh = new THREE.Points(geo, mat);
    this.mesh.renderOrder = 1;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  // scroll: 0..1, audio: 0..1
  update(dt, scroll, audio) {
    const drift = this.reducedMotion ? 0.3 : 1.0;
    const wobble = this.reducedMotion ? 0.0 : 1.0;
    for (let i = 0; i < this.count; i++) {
      this.x[i] += this.speed[i] * dt * 6 * drift;
      if (this.x[i] > 1.35) this.x[i] = -1.35;

      this.phase[i] += dt * (0.5 + this.depth[i]);
      const bob = Math.sin(this.phase[i]) * 0.04 * wobble;
      // Deeper fish parallax-shift less with scroll.
      const par = (scroll - 0.5) * 0.4 * (1.0 - this.depth[i]);

      this.positions[i * 3 + 0] = this.x[i];
      this.positions[i * 3 + 1] = this.y[i] + bob + par;
      this.positions[i * 3 + 2] = 0;

      const pulse = 1 + audio * 0.5 * this.depth[i];
      this.sizes[i] = this.baseSize[i] * pulse * (window.devicePixelRatio > 1 ? 1 : 0.8);
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.size.needsUpdate = true;
  }
}

function rand(a, b) {
  return a + Math.random() * (b - a);
}

// A small painted fish sprite: warm body, thin ink outline, fan tail.
function makeFishTexture() {
  const s = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  ctx.translate(s / 2, s / 2);

  ctx.fillStyle = "#f2c14e"; // golden gouache
  ctx.strokeStyle = "rgba(60,40,30,0.55)";
  ctx.lineWidth = 2.5;

  // body
  ctx.beginPath();
  ctx.ellipse(4, 0, 34, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // tail
  ctx.beginPath();
  ctx.moveTo(-26, 0);
  ctx.lineTo(-50, -16);
  ctx.lineTo(-44, 0);
  ctx.lineTo(-50, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // eye
  ctx.fillStyle = "rgba(40,30,25,0.9)";
  ctx.beginPath();
  ctx.arc(22, -3, 3, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
