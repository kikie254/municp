import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if ([...extensions].some((ext) => path.endsWith(ext))) files.push(path);
  }
}

for (const dir of sourceRoots) {
  if (existsSync(join(root, dir))) walk(join(root, dir));
}

const missingAssets = new Set();
const imagePattern = /["'`]((?:\/images\/)[^"'`?#]+)["'`]/g;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(imagePattern)) {
    const assetPath = resolve(root, "public", match[1].slice(1));
    if (!existsSync(assetPath)) missingAssets.add(`${match[1]} (referenced in ${relative(root, file)})`);
  }
}

if (missingAssets.size) {
  console.error("Missing local image assets:");
  for (const item of missingAssets) console.error(` - ${item}`);
  process.exitCode = 1;
} else {
  console.log(`Source asset check passed: scanned ${files.length} source files; all literal /images references exist.`);
}
