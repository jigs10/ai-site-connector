export interface ModelOption {
  value: string;
  label: string;
  hint?: string;
}

export const providerModels: Record<string, ModelOption[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o", hint: "Best for performance and reasoning" },
    { value: "gpt-4o-mini", label: "GPT-4o mini", hint: "Faster and more cost-effective" },
  ],
  google: [
    { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash", hint: "Fastest with 1M context" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", hint: "Excellent for complex tasks" },
  ],
  anthropic: [
    { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet", hint: "State of the art logic" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", hint: "Fast and lightweight" },
  ],
};
