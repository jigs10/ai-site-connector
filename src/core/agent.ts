import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import fs from 'node:fs';
import { loadConfig, KNOWLEDGE_PATH } from './config.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper to get the correct model based on environment variables
export function getModel() {
  const config = loadConfig();

  const provider = config.provider || 'openai';
  const modelName = config.model;

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
    throw new Error("Knowledge base not found. Run 'npx botcli-site setup' first.");
  }
  return fs.readFileSync(KNOWLEDGE_PATH, 'utf-8');
}

// Method 1: Simple text response (Perfect for CLI/Scripts)
export async function askAgent(input: string | any[]) {
  const options: any = {
    model: getModel(),
    system: `You are an expert assistant. Knowledge: ${getKnowledge()}`,
  };

  if (typeof input === 'string') {
    options.prompt = input;
  } else {
    options.messages = input;
  }

  const { text } = await generateText(options);
  return text;
}