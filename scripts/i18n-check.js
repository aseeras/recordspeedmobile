// Lists English text passed to t("…") that has no Spanish in src/lib/i18n/es.ts, and Spanish entries no
// longer used. Run: npm run i18n:check
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name) && !full.includes(`${path.sep}i18n${path.sep}`)) files.push(full);
  }
}
walk(path.join(root, "app"));
walk(path.join(root, "src"));

const used = new Set();
for (const file of files) {
  for (const m of fs.readFileSync(file, "utf8").matchAll(/\bt\("((?:[^"\\]|\\.)*)"/g)) used.add(JSON.parse(`"${m[1]}"`));
}
// Text that reaches t() through a variable: menu titles, sign-out notices, consent points, delete-account lists.
const dynamic = [
  /title: "([^"]+)"/g, /^\s+(?:idle|ended): "([^"]+)"/gm, /whatIsDeleted="([^"]+)"/g,
  /^\s+(?:starting|listening|thinking|speaking|muted): "([^"]+)"/gm,
];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  for (const re of dynamic) for (const m of src.matchAll(re)) used.add(m[1]);
}
const consent = fs.readFileSync(path.join(root, "src/lib/patient/consent.ts"), "utf8");
for (const m of consent.matchAll(/^\s+"([^"]+)",?$/gm)) used.add(m[1]);
used.add(consent.match(/CONSENT_TITLE = "([^"]+)"/)[1]);

const es = fs.readFileSync(path.join(root, "src/lib/i18n/es.ts"), "utf8");
const keys = new Set([...es.matchAll(/^\s+("(?:[^"\\]|\\.)*"):/gm)].map((m) => JSON.parse(m[1])));
const missing = [...used].filter((k) => !keys.has(k)).sort();
const unused = [...keys].filter((k) => !used.has(k)).sort();
missing.forEach((k) => console.log(`missing Spanish: ${k}`));
unused.forEach((k) => console.log(`not used: ${k}`));
console.log(`${used.size} strings, ${missing.length} missing, ${unused.length} unused`);
process.exit(missing.length ? 1 : 0);
