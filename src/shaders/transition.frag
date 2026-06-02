precision highp float;

varying vec2 vUv;

uniform sampler2D uTexA;   // current scene
uniform sampler2D uTexB;   // next scene
uniform float uProgress;   // 0..1 crossfade between A and B
uniform float uTime;       // seconds, for drifting liquid motion
uniform float uAudio;      // 0..1 smoothed audio amplitude
uniform float uIntensity;  // global trippy intensity (0 = reduced motion)
uniform vec2  uResolution; // canvas size in px
uniform vec2  uCover;      // uv scale to cover the viewport (object-fit: cover)

// 2D value noise — cheap, smooth, good enough for a gouache shimmer.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Sample a texture with object-fit: cover framing + chromatic split.
vec3 sampleScene(sampler2D tex, vec2 uv, vec2 displace, float aberration) {
  vec2 c = (uv - 0.5) * uCover + 0.5 + displace;
  vec2 dir = (uv - 0.5);
  vec3 col;
  col.r = texture2D(tex, c + dir * aberration).r;
  col.g = texture2D(tex, c).g;
  col.b = texture2D(tex, c - dir * aberration).b;
  return col;
}

void main() {
  vec2 uv = vUv;

  // Liquid drift: a slow flow field, swelling at mid-transition and with audio.
  float swell = sin(uProgress * 3.14159);           // 0 at scenes, 1 mid-melt
  float flow = (0.012 + uAudio * 0.03) * uIntensity;
  vec2 n = vec2(
    noise(uv * 3.0 + vec2(uTime * 0.05, uTime * 0.03)),
    noise(uv * 3.0 - vec2(uTime * 0.04, uTime * 0.06))
  ) - 0.5;
  vec2 displace = n * flow * (0.4 + swell);

  // Chromatic aberration: gentle at rest, blooming through the melt.
  float aberration = (0.0015 + swell * 0.012 + uAudio * 0.006) * uIntensity;

  vec3 a = sampleScene(uTexA, uv, displace, aberration);
  vec3 b = sampleScene(uTexB, uv, displace * 1.4, aberration);

  // Melt the crossfade edge with noise so scenes dissolve, not dip-to-fade.
  float edge = noise(uv * 6.0 + uTime * 0.02) - 0.5;
  float mixv = clamp(uProgress + edge * 0.35 * swell * uIntensity, 0.0, 1.0);
  vec3 col = mix(a, b, mixv);

  // Pastel bloom on the bright gouache areas, pulsing softly with the audio.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float bloom = smoothstep(0.6, 1.0, lum) * (0.12 + uAudio * 0.18) * uIntensity;
  col += bloom * vec3(1.0, 0.85, 0.95);

  // Faint analog shimmer / grain woven into the image.
  float g = noise(uv * uResolution * 0.5 + uTime) - 0.5;
  col += g * 0.04 * uIntensity;

  // Soft vignette to keep the dreamy frame.
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
  col *= mix(1.0, vig, 0.5);

  gl_FragColor = vec4(col, 1.0);
}
