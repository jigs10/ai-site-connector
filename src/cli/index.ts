import { chatLoop } from "../core/chat.js";
import { setupCommand } from "./commands/setup.js";
import { componentCommand } from "./commands/component.js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getVersion() {
  try {
    // Prod: dist/bin.js
    const pkgPath = path.join(__dirname, "../package.json");
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, "utf-8")).version;
    }
    // Dev: src/cli/index.ts
    const devPkgPath = path.join(__dirname, "../../package.json");
    if (fs.existsSync(devPkgPath)) {
      return JSON.parse(fs.readFileSync(devPkgPath, "utf-8")).version;
    }
  } catch {
    return "1.1.0";
  }
  return "1.1.0";
}

function printHelp() {
  console.log(`
Usage: botcli-site [command] [options]

Commands:
  setup      Interactive setup to configure AI and scrape site (default)
  chat       Start a chat session with your AI-ready site
  component  Add/remove React components to your project

Options:
  -v, --version  Show version number
  -h, --help     Show help
  `);
}

export async function runCli() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(getVersion());
    return;
  }

  if (command === "chat") {
    await chatLoop();
  } else if (command === "component") {
    await componentCommand();
  } else if (command === "setup") {
    await setupCommand();
  } else {
    // If no command is provided, default to setup but show a hint
    if (!command) {
      await setupCommand();
    } else {
      console.log(`Unknown command: ${command}`);
      printHelp();
    }
  }
}
