import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function jsFilesIn(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".js") || name.endsWith(".mjs"))
    .map((name) => path.join(dir, name));
}

const jsFiles = [
  "dev-server.js",
  ...jsFilesIn("js"),
  ...jsFilesIn("api"),
  ...jsFilesIn("scripts"),
];

let failed = false;

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`✗ ${file}`);
    failed = true;
  }
}

for (const file of ["package.json", "vercel.json"]) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`✓ ${jsFiles.length} JS files and 2 JSON files are valid`);
}
