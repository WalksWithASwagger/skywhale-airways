// Barrel for the Gate Infinity terminal artifacts. Each artifact lives in its
// own module under ./artifacts/ and shares the CanvasArtifact base + drawing
// primitives in ./artifacts/canvas-kit.js and ./artifacts/canvas-draw.js.
// main.js imports the three classes from here, so this path stays stable.

export { GateReceipt } from "./artifacts/gate-receipt.js";
export { RoutePostcard } from "./artifacts/route-postcard.js";
export { SuitcaseManifest } from "./artifacts/suitcase-manifest.js";
