import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageJson = JSON.parse(
  readFileSync(path.join(repoRoot, "package.json"), "utf8")
);
const schema = readFileSync(path.join(repoRoot, ".env.schema"), "utf8");
const example = readFileSync(path.join(repoRoot, ".env.example"), "utf8");
const readme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
const productionSchema = readFileSync(
  path.join(repoRoot, "production/.env.schema"),
  "utf8"
);
const productionReadme = readFileSync(
  path.join(repoRoot, "production/README.md"),
  "utf8"
);

const PROJECT_IMPORT =
  "# @import(~/.agents/env/values/.env.skywhale-airways.local, allowMissing=true)";
const PROJECT_PICK_IMPORT =
  "# @import(~/.agents/env/values/.env.skywhale-airways.local, pick=[";
const SHARED_PICK_IMPORT =
  "# @import(~/.agents/env/values/.env.shared.local, pick=[";

const SITE_KEYS = [
  "VITE_BASE_PATH",
  "VITE_SITE_URL",
  "VITE_GA_MEASUREMENT_ID",
  "VITE_GOOGLE_SITE_VERIFICATION",
  "VITE_SHOPIFY_DOMAIN",
  "VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "VITE_SHOPIFY_NOMAD_STICKER_PRODUCT_ID",
  "VITE_SHOPIFY_NOMAD_PATCH_PRODUCT_ID",
  "VITE_SHOPIFY_NOMAD_TEE_PRODUCT_ID",
  "VITE_SHOPIFY_CHEST_PATCH_PRODUCT_ID",
  "VITE_SHOPIFY_CHEST_DECAL_PRODUCT_ID",
  "VITE_SHOPIFY_DECADE_WEATHER_CARD_PRODUCT_ID",
  "VITE_SHOPIFY_BAGGAGE_TAG_PRODUCT_ID",
  "VITE_SHOPIFY_GRAVITY_STICKER_PRODUCT_ID",
  "VITE_SHOPIFY_GRAVITY_TEE_PRODUCT_ID",
  "VITE_SHOPIFY_PIN_SET_PRODUCT_ID",
  "VITE_SHOPIFY_RELICS_SHEET_PRODUCT_ID",
];

const PRODUCTION_KEYS = [
  "REPLICATE_API_TOKEN",
  "GOOGLE_API_KEY",
  "GEMINI_API_KEY",
  "ELEVENLABS_API_KEY",
  "OPENAI_API_KEY",
];

test("dev injects through Varlock and build stays unwired", () => {
  assert.match(packageJson.scripts.dev, /varlock run --inject vars -- vite/);
  assert.equal(packageJson.scripts.build.includes("varlock"), false);
  assert.equal(packageJson.scripts.preview.includes("varlock"), false);
  assert.equal(packageJson.scripts["check:seo"].includes("varlock"), false);
});

test("root schema imports the project values file without a pick list", () => {
  assert.equal(schema.includes(PROJECT_IMPORT), true);
  assert.equal(schema.includes(PROJECT_PICK_IMPORT), false);
  for (const key of SITE_KEYS) {
    assert.equal(
      schema.includes(`${key}=`),
      true,
      `missing ${key} in .env.schema`
    );
    assert.equal(example.includes(key), true, `missing ${key} in .env.example`);
  }
});

test("production schema imports the same project file without a pick list", () => {
  assert.equal(productionSchema.includes(PROJECT_IMPORT), true);
  assert.equal(productionSchema.includes(PROJECT_PICK_IMPORT), false);
  assert.equal(productionSchema.includes(SHARED_PICK_IMPORT), true);
  for (const key of PRODUCTION_KEYS) {
    assert.equal(
      productionSchema.includes(`${key}=`),
      true,
      `missing ${key} in production/.env.schema`
    );
  }
});

test("documented secret-using commands go through Varlock", () => {
  assert.equal(readme.includes("varlock run --inject vars"), true);
  assert.equal(
    productionReadme.includes(
      "varlock run --inject vars -- python3 scripts/run_i2v_pipeline.py"
    ),
    true
  );
  assert.equal(
    productionReadme.includes("\n   python3 scripts/run_i2v_pipeline.py"),
    false
  );
});
