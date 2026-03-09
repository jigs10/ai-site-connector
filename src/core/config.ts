import fs from "node:fs";
import path from "node:path";

export interface AiSiteConfig {
  provider?: "openai" | "google" | "anthropic";
  model?: string;
  url?: string;
  updatedAt?: string;
}

export const CONFIG_PATH = path.join(process.cwd(), "ai-site.config.json");
export const ENV_PATH = path.join(process.cwd(), ".env");

export function loadConfig(): AiSiteConfig {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  }
  return {};
}

export function saveConfig(config: AiSiteConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function updateEnv(provider: string, aiKey?: string, firecrawlKey?: string) {
  const envKeyName = 
    provider === "openai" ? "OPENAI_API_KEY" : 
    provider === "google" ? "GEMINI_API_KEY" : "ANTHROPIC_API_KEY";

  let existingEnv = "";
  if (fs.existsSync(ENV_PATH)) {
    existingEnv = fs.readFileSync(ENV_PATH, "utf-8");
  }

  let envEntry = "";
  if (aiKey && !existingEnv.includes(`${envKeyName}=`)) {
    envEntry += `\n${envKeyName}=${aiKey}`;
  }
  if (firecrawlKey && !existingEnv.includes("FIRECRAWL_API_KEY=")) {
    envEntry += `\nFIRECRAWL_API_KEY=${firecrawlKey}`;
  }

  if (envEntry) {
    fs.appendFileSync(ENV_PATH, envEntry + "\n");
  }
}
