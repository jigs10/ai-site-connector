export interface ModelOption {
  value: string;
  label: string;
  hint?: string;
  category: "frontier" | "balanced" | "agent" | "cost-efficient";
}

export const providerModels: Record<string, ModelOption[]> = {
  openai: [
    { value: "gpt-5.4-pro", label: "GPT-5.4 Pro", hint: "Current flagship, best for reasoning", category: "frontier" },
    { value: "gpt-5.2", label: "GPT-5.2", hint: "Best for coding and agents", category: "frontier" },
    { value: "gpt-5-mini", label: "GPT-5 mini", hint: "Balanced speed and quality", category: "balanced" },
    { value: "gpt-5-nano", label: "GPT-5 nano", hint: "Cheapest model available", category: "cost-efficient" },
    { value: "gpt-4.1-mini", label: "GPT-4.1 mini", hint: "Solid for standard chat tasks", category: "cost-efficient" },
    { value: "gpt-4.1-nano", label: "GPT-4.1 nano", hint: "Ultra-fast generation", category: "cost-efficient" },
    { value: "gpt-5.4-thinking", label: "GPT-5.4 Thinking", hint: "Drafts a plan before executing", category: "agent" },
    { value: "gpt-5.3-codex", label: "GPT-5.3 Codex", hint: "Tailored for large-scale coding", category: "agent" },
    { value: "o3-deep-research", label: "o3 Deep Research", hint: "Multi-step reasoning agents", category: "agent" },
  ],
  google: [
    { value: "gemini-3.1-pro", label: "Gemini 3.1 Pro", hint: "Flagship, best for deep analysis", category: "frontier" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", hint: "Strong coding performance", category: "frontier" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", hint: "Excellent speed/quality balance", category: "balanced" },
    { value: "gemini-3-flash", label: "Gemini 3 Flash", hint: "Optimized for tool-use and audio/visual", category: "agent" },
    { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite", hint: "Ultra-fast for high-volume", category: "cost-efficient" },
  ],
  anthropic: [
    { value: "claude-opus-4.6", label: "Claude 4.6 Opus", hint: "Smartest for complex research", category: "frontier" },
    { value: "claude-opus-4.1", label: "Claude 4.1 Opus", hint: "Nuanced writing and reasoning", category: "frontier" },
    { value: "claude-sonnet-4.6", label: "Claude 4.6 Sonnet", hint: "Best overall, 1M context window", category: "balanced" },
    { value: "claude-sonnet-4.5", label: "Claude 4.5 Sonnet", hint: "State of the art logic", category: "balanced" },
    { value: "claude-haiku-4.5", label: "Claude 4.5 Haiku", hint: "Extremely fast and affordable", category: "cost-efficient" },
  ],
};
