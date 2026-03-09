import { generateText, streamText, type StreamTextResult } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import fs from 'node:fs';
import { loadConfig } from './config.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper to get the correct model based on environment variables
function getModel() {
  const config = loadConfig();

  const provider = config.provider || 'openai';
  const modelName = config.model;

  if (provider === 'google') {
    const apiKey = process.env.GEMINI_API_KEY;
    const google = createGoogleGenerativeAI({ apiKey });
    return google(modelName || 'gemini-1.5-flash');
  } else if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const anthropic = createAnthropic({ apiKey });
    return anthropic(modelName || 'claude-3-5-sonnet-20240620');
  } else {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = createOpenAI({ apiKey });
    return openai(modelName || 'gpt-4o');
  }
}

// Helper to get knowledge base content
function getKnowledge() {
  if (!fs.existsSync('ai-knowledge.md')) {
    throw new Error("Knowledge base not found. Run 'npx ai-site-connector' first.");
  }
  return fs.readFileSync('ai-knowledge.md', 'utf-8');
}

/**
 * Method 1: Simple text response (Perfect for CLI/Scripts)
 */
export async function askAgent(question: string) {
  const { text } = await generateText({
    model: getModel(),
    system: `You are an expert assistant. Knowledge: ${getKnowledge()}`,
    prompt: question,
  });
  return text;
}

/**
 * Method 2: Streaming response (Perfect for Next.js/React)
 */
export async function streamAgent(question: string): Promise<StreamTextResult<any, any>> {
  return streamText({
    model: getModel(),
    system: `You are an expert assistant. Knowledge: ${getKnowledge()}`,
    prompt: question,
  });
}