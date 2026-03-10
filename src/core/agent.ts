import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import fs from 'node:fs';
import { loadConfig, KNOWLEDGE_PATH, type AiSiteConfig } from './config.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper to get the correct model based on environment variables
export function getModel(overrides?: { provider?: string; model?: string }) {
  const config = loadConfig();

  const provider = overrides?.provider || config.provider || 'openai';
  
  let modelName: string | undefined;

  // If the provider is overridden to something different than the config,
  // we should NOT use the model from the config because it belongs to a different provider.
  if (overrides?.model) {
    modelName = overrides.model;
  } else if (overrides?.provider && overrides.provider !== config.provider) {
    modelName = undefined; // This will trigger the default for the new provider
  } else {
    modelName = config.model;
  }

  if (provider === 'google') {
    const apiKey = process.env.GEMINI_API_KEY;
    const google = createGoogleGenerativeAI({ apiKey });
    return google(modelName || 'gemini-3.1-flash-lite');
  } else if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const anthropic = createAnthropic({ apiKey });
    return anthropic(modelName || 'claude-sonnet-4.6');
  } else {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = createOpenAI({ apiKey });
    return openai(modelName || 'gpt-5-mini');
  }
}

// Helper to get knowledge base content
export function getKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_PATH)) {
    throw new Error("Knowledge base not found. Run 'npx bot4site setup' first.");
  }
  return fs.readFileSync(KNOWLEDGE_PATH, 'utf-8');
}

// Method 1: Simple text response (Perfect for CLI/Scripts)
export async function askAgent(input: string | any[], overrides?: Partial<AiSiteConfig>) {
  const config = loadConfig();
  
  // Logic for merging is now handled inside getModel to ensure provider/model sync
  const systemInstruction = overrides?.systemInstruction || config.systemInstruction || "You are an expert assistant.";

  const options: any = {
    model: getModel({ provider: overrides?.provider, model: overrides?.model }),
    system: `${systemInstruction} Knowledge: ${getKnowledge()}`,
  };

  if (typeof input === 'string') {
    options.prompt = input;
  } else {
    options.messages = input;
  }

  const { text } = await generateText(options);
  return text;
}