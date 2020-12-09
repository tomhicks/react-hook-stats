import * as fs from "fs";
import * as path from "path";
import { collectStats } from "./collect-stats";
import { drawPng, drawTerminal } from "./draw";

async function main() {
  console.log("👍 🐟 Thanks for using react-hook-stats!");
  console.log();

  const absolutePath = path.resolve(process.cwd(), process.argv[2]);
  const stats = await collectStats(absolutePath);

  if (Math.max(...stats.map((s) => s.value)) === 0) {
    console.log("🤔 I couldn't find any hooks used.");
    console.log("Use react-hook-stats like this: npx react-hook-stats src");
    console.log("Where src is your source directory.");
    return;
  }

  drawTerminal({ data: stats });

  const buffer = drawPng({
    data: stats,
  });
  const pngPath = path.join(process.cwd(), "react-hook-stats.png");
  fs.writeFileSync(pngPath, buffer);
  console.log();
  console.log("📊 A PNG file of your stats is here:");
  console.log(pngPath);
}

main().catch(console.error);
