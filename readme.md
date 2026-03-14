# Bot4site 🚀

Seamlessly connect AI chat bots to your website. This CLI tool automates website scraping for context and provides ready-to-use React components.

[![npm version](https://img.shields.io/npm/v/bot4site.svg)](https://www.npmjs.com/package/bot4site)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/jigs10?color=ea4aaa&logo=github)](https://github.com/sponsors/jigs10)

Bot4site is a command-line interface (CLI) tool designed to interact with AI models and scrape website content. It provides functionalities for setting up your environment, configuring AI models and data sources, and engaging in chat-based interactions with the configured AI.

## Features

*   **🤖 Multi-Provider Support**: Works with OpenAI (GPT-5), Google (Gemini 3.1), and Anthropic (Claude 4.6).
*   **🌐 Smart Scraping**: Powered by Firecrawl to turn any website into a clean Markdown knowledge base with configurable page limits.
*   **🧩 React Components**: Instant UI components (Chat Widget, Sticky Button) for your frontend.
*   **💬 CLI Chat**: Test your AI agent directly in the terminal before deploying.
*   **🛠 Easy Setup**: A straightforward setup process to get your AI connector running quickly.

## Installation

To use Bot4site, you need to have Node.js and npm installed.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jigs10/ai-site-connector.git
    cd ai-site-connector
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Build the project**:
    ```bash
    npm run build
    ```

## Quick Start (NPM)

If you've installed it via NPM, you can simply run:

```bash
npx bot4site setup
```

## Configuration

The `ai-site.config.json` file is used to configure the AI model, provider, and the target URL for scraping. An example configuration looks like this:

```json
{
  "model": "gemini-3.1-flash-lite",
  "provider": "google",
  "updatedAt": "2026-03-09T04:44:35.157Z",
  "url": "https://example.com/",
  "limit": 20,
  "systemInstruction": "You are a helpful customer support agent for my website.",
  "storage": "pinecone",
  "pineconeIndex": "bot4site-index"
}
```

You can modify these values to suit your needs. Sensitive keys are stored in a `.env` file (see [.env.example](.env.example) for a template):
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `FIRECRAWL_API_KEY`
- `PINECONE_API_KEY` (Required for Vector DB)

## Usage

### Server Setup (Node.js/Backend)

The server-side setup configures your AI provider and scrapes your website content into a local knowledge base (`ai-knowledge.md`). This knowledge base is used to provide context to the AI.

1.  **Run the setup command**:
    ```bash
    npx bot4site setup
    ```
2.  **Select "Server-based (Node.js)"** when prompted.
3.  **Follow the interactive prompts** to configure your AI provider, enter your API keys, provide the URL of the website, and specify the number of pages to scrape.

Once complete, you'll have an `ai-knowledge.md` file ready to be used by the agent.

### Client Setup (React/Frontend)

The client-side setup provides pre-built React components that you can easily integrate into your frontend application.

1.  **Run the component command**:
    ```bash
    npx bot4site component
    ```
2.  **Select the components** you want to add (e.g., Chat Widget, Sticky Button).
3.  The tool will create a `components/` directory in your project root containing the selected React components.

### Chat Command

To verify your setup and interact with your site's data via the CLI:

```bash
npx bot4site chat
```

### Vector Database Setup (Pinecone) [Beta]

Bot4site supports using **Pinecone** as a vector database for more scalable and efficient context retrieval. 

#### Key Differences from Local Flow:
- **No Local File**: When using Pinecone, the scraped content is uploaded directly to your index. No `ai-knowledge.md` is created.
- **Strict Validation**: The system will throw clear errors if your `pineconeIndex` is missing from `ai-site.config.json` or if the `PINECONE_API_KEY` environment variable is not set.

#### Setup Steps:
1.  **Get a Pinecone API Key**: Sign up at [pinecone.io](https://www.pinecone.io/) and create an API key.
2.  **Run Setup**: Run `npx bot4site setup` and select `Vector DB (Pinecone) [Beta]` when prompted for storage.
3.  **Automatic Indexing**: The tool will automatically create a serverless index (default: `bot4site-index`) using the `llama-text-embed-v2` embedding model on AWS. The index name will be saved to your `ai-site.config.json`.

#### How it Works:
1.  **Scrape**: Website content is scraped using Firecrawl.
2.  **Chunk**: The content is split into manageable text segments.
3.  **Embed & Upsert**: Chunks are uploaded to Pinecone with integrated serverless embeddings.
4.  **Semantic Search**: When chatting, the tool queries Pinecone using the index specified in your config to retrieve relevant context dynamically.

## Programmatic Usage

You can also use the core logic in your own Node.js backend. The function `askAgent` supports both string prompts and the `messages` array format used by the Vercel AI SDK.

```typescript
import { askAgent } from 'bot4site';

// 1. Simple text response (supports string or message history)
const text = await askAgent("How do I contact support?");
console.log(text);
```

### Global vs. Local Overrides

Bot4site uses a hierarchical configuration system. Your `ai-site.config.json` serves as the **Global Default**, but you can provide **Local Overrides** for specific function calls.

```typescript
import { askAgent } from 'bot4site';

// 1. Uses GLOBAL settings (e.g. Gemini 2.5 Flash from config)
const defaultResponse = await askAgent("Hello!");

// 2. Uses LOCAL overrides for this specific call
const customResponse = await askAgent("Special task", {
  provider: "anthropic",
  model: "claude-opus-4.6", // Specifically use a different provider and model
  systemInstruction: "You are a code reviewer."
});

// 3. Provider/Model Coupling
// If you override the provider but NOT the model, it automatically 
// uses that provider's default to prevent cross-provider errors.
const providerSwap = await askAgent("Hi", { provider: 'google' }); 
// ^ Uses Google default (Gemini) instead of the global OpenAI config
```

### Next.js Server Actions Example

You can use `askAgent` within Next.js Server Actions for a clean client-server integration:

**actions.ts (Server)**
```typescript
'use server';

import { askAgent } from 'bot4site';

export async function getAnswer(question: string) {
  const text = await askAgent(question);
  return { text };
}
```

**page.tsx (Client)**
```tsx
'use client';

import { useState } from 'react';
import { getAnswer } from './actions';

export default function Home() {
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const { text } = await getAnswer('What are the main features?');
          setGeneration(text);
          setLoading(false);
        }}
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>
      <div style={{ whiteSpace: 'pre-wrap' }}>{generation}</div>
    </div>
  );
}
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Support the Project 💖

If you find **Bot4site** helpful and want to support its development, consider becoming a sponsor. Your support helps cover costs for testing and allows me to dedicate more time to maintaining the project.

[👉 Sponsor jigs10 on GitHub](https://github.com/sponsors/jigs10)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
