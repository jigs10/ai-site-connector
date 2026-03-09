import { chatLoop } from "../core/chat.js";
import { setupCommand } from "./commands/setup.js";
import dotenv from "dotenv";

dotenv.config();

export async function runCli() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "chat") {
    await chatLoop();
  } else {
    await setupCommand();
  }
}
