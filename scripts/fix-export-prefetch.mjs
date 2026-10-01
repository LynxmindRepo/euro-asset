// Post-build fix for the static export (runs automatically after `npm run build`).
//
// Next 16 writes the per-segment prefetch files as nested folders, e.g.
//   out/listings/__next.listings/__PAGE__.txt
// but the client router requests a flat, dot-separated name:
//   /listings/__next.listings.__PAGE__.txt
// On a static host (GitHub Pages) that request is a 404. Navigation still works (the router falls back),
// but every visible link logs a 404 and prefetching is lost. This copies each nested file to the flat name.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const outDir = join(process.cwd(), "out");

if (!existsSync(outDir)) {
  console.log("fix-export-prefetch: no out/ folder, nothing to do.");
  process.exit(0);
}

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

let copied = 0;

function visit(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;

    if (name.startsWith("__next.")) {
      for (const file of filesIn(path)) {
        // "__next.listings/$d$id/__PAGE__.txt" -> "__next.listings.$d$id.__PAGE__.txt", next to the folder.
        const flat = relative(dir, file).split(sep).join(".");
        const target = join(dir, flat);
        if (!existsSync(target)) {
          copyFileSync(file, target);
          copied += 1;
        }
      }
    } else {
      visit(path);
    }
  }
}

visit(outDir);
console.log(`fix-export-prefetch: ${copied} prefetch file(s) copied to their flat names.`);
