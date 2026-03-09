import { chatLoop } from "../core/chat.js";
import { setupCommand } from "./commands/setup.js";
import { componentCommand } from "./commands/component.js";
import dotenv from "dotenv";

dotenv.config();

export async function runCli() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "chat") {
    await chatLoop();
  } else if (command === "component") {
    await componentCommand();
  } 
  else {
    await setupCommand();
  }
}
