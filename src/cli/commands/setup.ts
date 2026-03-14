import * as p from "@clack/prompts";
import color from "picocolors";
import fs from "node:fs";
import { providerModels } from "../../core/constants.js";
import { loadConfig, saveConfig, updateEnv, KNOWLEDGE_PATH, type AiSiteConfig } from "../../core/config.js";
import { scrapeToMarkdown } from "../../core/scraper.js";
import { componentCommand } from "./component.js";

export async function serverSetupCommand() {
  p.log.info(color.cyan("Initializing server-side setup..."));
}

export async function setupCommand() {
  p.intro(color.bgCyan(color.black(" bot4site ")));

  const existingConfig = loadConfig();
  if (Object.keys(existingConfig).length > 0) {
    p.log.info(color.dim("Found existing configuration."));
  }

  const appType = await p.select({
    message: "Is this a client-based (React/Next.js) or server-based (Node.js) application?",
    options: [
      { value: "client", label: "Client-based (React/Next.js)" },
      { value: "server", label: "Server-based (Node.js)" },
    ],
  });

  if (p.isCancel(appType)) {
    p.cancel("Setup aborted.");
    process.exit(0);
  }

  if (appType === "client") {
    await componentCommand();
    p.outro(color.bgGreen(color.black(" Component setup complete! ")) + "\n\n" +
            color.dim("──────────────────────────────────────────────────") + "\n" +
            color.bold("Next steps:") + "\n" +
            color.yellow("1.") + " Review the newly added components in your 'components' directory.\n" +
            color.yellow("2.") + " Integrate them into your React/Next.js application as needed.");
    return;
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
      limit: () =>
        p.text({
          message: "Max pages to scrape",
          placeholder: (existingConfig.limit || 20).toString(),
          initialValue: (existingConfig.limit || 20).toString(),
          validate: (v) => (isNaN(Number(v)) ? "Must be a number" : undefined),
        }),
      systemInstruction: () =>
        p.text({
          message: "Define the AI's global persona/instructions",
          placeholder: "e.g., You are a helpful support agent for our SaaS.",
          initialValue: existingConfig.systemInstruction || "You are an expert assistant.",
        }),
      storage: () =>
        p.select({
          message: "Where would you like to store the knowledge base?",
          initialValue: existingConfig.storage || "local",
          options: [
            { value: "local", label: "Local Markdown file", hint: "Simple, no extra cost" },
            { value: "pinecone", label: "Vector DB (Pinecone) [Beta]", hint: "Scalable search" },
          ],
        }),
      pineconeKey: ({ results }) => {
        if (results.storage !== "pinecone" || process.env.PINECONE_API_KEY) return;
        return p.password({
          message: "Enter Pinecone API Key",
          validate: (v) => (!v ? "Required for Vector DB" : undefined),
        });
      },
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
      limit: Number(project.limit),
      systemInstruction: project.systemInstruction as string,
      storage: project.storage as AiSiteConfig["storage"],
      pineconeIndex: project.storage === "pinecone" ? "bot4site-index" : undefined,
      updatedAt: new Date().toISOString(),
    };
    saveConfig(configData);
    updateEnv(
      project.provider as string, 
      project.aiKey as string, 
      project.firecrawlKey as string,
      project.pineconeKey as string
    );
    
    p.log.step(color.green("Config and .env updated."));
  }

  await serverSetupCommand();
  s.start(`Analyzing ${project.url}...`);
  try {
    process.env.FIRECRAWL_API_KEY = (project.firecrawlKey as string) || process.env.FIRECRAWL_API_KEY;
    if (project.storage === "pinecone") {
      process.env.PINECONE_API_KEY = (project.pineconeKey as string) || process.env.PINECONE_API_KEY;
    }

    const markdown = await scrapeToMarkdown(project.url as string, Number(project.limit));

    if (project.storage === "pinecone") {
      s.message("Uploading to Pinecone...");
      const { uploadToPinecone } = await import("../../core/vector-db.js");
      await uploadToPinecone(markdown, "bot4site-index");
      s.stop(`Knowledge Base created and uploaded to ${color.cyan("Pinecone")}`);
    } else {
      fs.writeFileSync(KNOWLEDGE_PATH, markdown);
      s.stop(`Knowledge Base created: ${color.cyan("ai-knowledge.md")}`);
    }
  } catch (err: any) {
    s.stop(color.red("Scraping/Upload failed"));
    p.log.error(err.message);
    process.exit(1);
  }

  p.outro(
    `${color.bgGreen(color.black(" Success! "))} Your site is now AI-ready.\n\n` +
      `${color.dim("──────────────────────────────────────────────────")}\n` +
      `${color.bold("Files/Resources Created:")}\n` +
      (project.storage === "pinecone" 
        ? `• ${color.cyan("Pinecone Index")} (Vector storage)\n` 
        : `• ${color.cyan("ai-knowledge.md")} (Local context)\n`) +
      `• ${color.cyan(".env")} (API Keys stored)\n` +
      `• ${color.cyan("ai-site.config.json")} (Preferences)\n\n` +
      `${color.bold("Next steps:")}\n` +
      `${color.yellow("1.")} Import ${color.green("askAgent")} in your code\n` +
      `${color.yellow("2.")} Run ${color.magenta("npx bot4site chat")} to start chatting`
  );
}
