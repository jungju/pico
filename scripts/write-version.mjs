import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function gitShortCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);

  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "dev";
  }
}

const version = {
  app: "pico",
  buildTime: new Date().toISOString(),
  commit: gitShortCommit(),
};

const outputDir = process.argv[2] || "dist";

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "version.json"), `${JSON.stringify(version, null, 2)}\n`);
