import * as p from "@clack/prompts";
import color from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { providerModels } from "../../core/constants.js";
import { loadConfig, saveConfig, updateEnv, type AiSiteConfig } from "../../core/config.js";
import { scrapeToMarkdown } from "../../core/scraper.js";

export async function setupCommand() {
  p.intro(color.bgCyan(color.black(" ai-site-connector ")));

  const existingConfig = loadConfig();
  if (Object.keys(existingConfig).length > 0) {
    p.log.info(color.dim("Found existing configuration."));
  }

  const project = await p.group(
    {
      provider: () =>
        p.select({
          message: "Which AI provider would you like to use?",
          initialValue: existingConfig.provider || "openai",
          options: [
            { value: "openai", label: "OpenAI", hint: "GPT models" },
            { value: "google", label: "Google Gemini", hint: "Fast & 1M+ Context" },
            { value: "anthropic", label: "Anthropic", hint: "Claude models" },
          ],
        }),
      model: ({ results }) =>
        p.select({
          message: `Which ${results.provider} model?`,
          initialValue: existingConfig.model || providerModels[results.provider!][0].value,
          options: providerModels[results.provider!],
        }),
      aiKey: ({ results }) => {
        const envKey = results.provider === "openai" ? "OPENAI_API_KEY" : 
                       results.provider === "google" ? "GEMINI_API_KEY" : "ANTHROPIC_API_KEY";
        if (process.env[envKey]) return;
        
        return p.password({
          message: `Enter your ${results.provider} API Key`,
          validate: (v) => (!v ? "Key required" : undefined),
        });
      },
      firecrawlKey: () => {
        if (process.env.FIRECRAWL_API_KEY) return;
        
        return p.password({
          message: "Enter Firecrawl API Key",
          validate: (v) => (!v ? "Required for scraping" : undefined),
        });
      },
      url: () =>
        p.text({
          message: "Enter the website URL to scrape",
          placeholder: existingConfig.url || "https://example.com",
          validate: (v) => (!v ? "URL required" : undefined),
        }),
      saveConfig: () =>
        p.confirm({
          message: "Save these settings to config and .env?",
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Setup aborted.");
        process.exit(0);
      },
    }
  );

  const s = p.spinner();

  if (project.saveConfig) {
    const configData: AiSiteConfig = {
      provider: project.provider as AiSiteConfig["provider"],
      model: project.model as string,
      url: project.url as string,
      updatedAt: new Date().toISOString(),
    };
    saveConfig(configData);
    updateEnv(project.provider as string, project.aiKey as string, project.firecrawlKey as string);
    
    p.log.step(color.green("Config and .env updated."));
  }

  s.start(`Analyzing ${project.url}...`);
  try {
    process.env.FIRECRAWL_API_KEY = (project.firecrawlKey as string) || process.env.FIRECRAWL_API_KEY;
    const markdown = await scrapeToMarkdown(project.url as string);

    const outputFileName = "ai-knowledge.md";
    fs.writeFileSync(path.join(process.cwd(), outputFileName), markdown);

    s.stop(`Knowledge Base created: ${color.cyan(outputFileName)}`);
  } catch (err: any) {
    s.stop(color.red("Scraping failed"));
    p.log.error(err.message);
    process.exit(1);
  }

  p.outro(
    `${color.bgGreen(color.black(" Success! "))} Your site is now AI-ready.\n\n` +
      `${color.dim("──────────────────────────────────────────────────")}\n` +
      `${color.bold("Files Created/Updated:")}\n` +
      `• ${color.cyan("ai-knowledge.md")} (Your context)\n` +
      `• ${color.cyan(".env")} (API Keys stored)\n` +
      `• ${color.cyan("ai-site.config.json")} (Preferences)\n\n` +
      `${color.bold("Next steps:")}\n` +
      `${color.yellow("1.")} Import ${color.green("streamAgent")} in your code\n` +
      `${color.yellow("2.")} Run ${color.magenta("npx ai-site-connector chat")} to start chatting`
  );
}
