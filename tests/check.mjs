// Quick content check: run with `node tests/check.mjs` before every release.
// Fails if a text key is missing in English or Urdu, or a price or date is broken.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../site/", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(read("js/config.js") + read("js/i18n.js"), sandbox);
const { SITE_CONFIG: config, SITE_TEXT: text } = sandbox.window;

const problems = [];
const html = read("index.html");
const usedKeys = new Set([
  ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) => m[1].split(";").map((p) => p.split(":")[1].trim())),
  ...[...read("js/main.js").matchAll(/\bt\("([A-Za-z]+)"\)/g)].map((m) => m[1]),
]);

for (const key of usedKeys) {
  for (const lang of ["en", "ur"]) if (!text[lang][key]) problems.push(`Missing ${lang} text for "${key}"`);
}
for (const key of Object.keys(text.en)) if (!(key in text.ur)) problems.push(`Urdu is missing "${key}"`);

function checkBilingual(value, where) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("en" in value || "ur" in value)) {
    if (!value.en || !value.ur) problems.push(`${where} needs both en and ur`);
    if (Array.isArray(value.en) && value.en.length !== value.ur.length) problems.push(`${where} has different list lengths`);
    return;
  }
  if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) checkBilingual(v, `${where}.${k}`);
}
checkBilingual(config, "config");

const sizeIds = config.carSizes.map((s) => s.id);
for (const pkg of config.packages) {
  for (const id of sizeIds) {
    if (!Number.isFinite(pkg.prices[id]) || pkg.prices[id] <= 0) problems.push(`${pkg.id} has no valid price for ${id}`);
  }
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
for (const offer of config.offers) {
  for (const field of ["starts", "ends"]) {
    if (offer[field] && !isoDate.test(offer[field])) problems.push(`Offer ${offer.id}: ${field} must be YYYY-MM-DD`);
  }
  if (offer.starts && offer.ends && offer.ends < offer.starts) problems.push(`Offer ${offer.id} ends before it starts`);
}

if (!/^92\d{10}$/.test(config.business.whatsapp)) problems.push("WhatsApp number must look like 923001234567");

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`✓ Content check passed (${usedKeys.size} text keys, ${config.packages.length} packages, ${config.offers.length} offers)`);
if (config.isDraft) console.log("! isDraft is still true: details are samples, not ready to go live.");
