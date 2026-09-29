// Bundle budget: fails when the JavaScript a first visit downloads grows past the limit.
// "Initial" = the entry chunk plus every chunk index.html preloads. Lazy screens and the
// Firebase chunks (loaded after the first render) are reported but not counted.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

// The home (landing page) chunks are preloaded, so they count. ~144 kB today: ~130 kB of app
// plus ~14 kB of Motion's runtime (its animation features, 27 kB, load after first render).
const BUDGET_KB = 150;
const dist = "dist";
const assets = join(dist, "assets");

const html = readFileSync(join(dist, "index.html"), "utf8");
const initial = new Set(
  [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((match) => match[1]),
);

const gzipKb = (file) => gzipSync(readFileSync(join(assets, file))).length / 1024;
const rows = readdirSync(assets)
  .filter((file) => file.endsWith(".js"))
  .map((file) => ({ file, kb: gzipKb(file), initial: initial.has(file) }))
  .sort((a, b) => b.kb - a.kb);

const total = rows.filter((row) => row.initial).reduce((sum, row) => sum + row.kb, 0);

for (const row of rows.slice(0, 8)) {
  console.log(
    `${row.initial ? "initial" : "lazy   "}  ${row.kb.toFixed(1).padStart(6)} kB  ${row.file}`,
  );
}
console.log(`\nInitial JS: ${total.toFixed(1)} kB gzip (budget ${BUDGET_KB} kB)`);

if (total > BUDGET_KB) {
  console.error(`Over budget by ${(total - BUDGET_KB).toFixed(1)} kB.`);
  process.exit(1);
}
