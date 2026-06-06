// Barrel for the Gate Infinity terminal artifacts. Each artifact lives in its
// own module under ./artifacts/ and shares the CanvasArtifact base + drawing
// primitives in ../canvas/ (canvas-kit.js, canvas-draw.js — also used by the
// boarding-pass / decade-weather / passport-stamp widgets).
// main.js imports the three classes from here, so this path stays stable.

export { GateReceipt } from "./artifacts/gate-receipt.js";
export { RoutePostcard } from "./artifacts/route-postcard.js";
export { SuitcaseManifest } from "./artifacts/suitcase-manifest.js";
