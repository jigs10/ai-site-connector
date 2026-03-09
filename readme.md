# Botcli-site 🚀

Seamlessly connect AI chat bots to your website. This CLI tool automates website scraping for context and provides ready-to-use React components.

[![npm version](https://img.shields.io/npm/v/botcli-site.svg)](https://www.npmjs.com/package/botcli-site)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Botcli-site is a command-line interface (CLI) tool designed to interact with AI models and scrape website content. It provides functionalities for setting up your environment, configuring AI models and data sources, and engaging in chat-based interactions with the configured AI.

## Features

*   **🤖 Multi-Provider Support**: Works with OpenAI (GPT-5), Google (Gemini 3.1), and Anthropic (Claude 4.6).
*   **🌐 Smart Scraping**: Powered by Firecrawl to turn any website into a clean Markdown knowledge base with configurable page limits.
*   **🧩 React Components**: Instant UI components (Chat Widget, Sticky Button) for your frontend.
*   **💬 CLI Chat**: Test your AI agent directly in the terminal before deploying.
*   **🛠 Easy Setup**: A straightforward setup process to get your AI connector running quickly.

## Installation

To use Botcli-site, you need to have Node.js and npm installed.

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
npx botcli-site setup
```

## Configuration

The `ai-site.config.json` file is used to configure the AI model, provider, and the target URL for scraping. An example configuration looks like this:

```json
{
  "model": "gemini-3.1-flash-lite",
  "provider": "google",
  "updatedAt": "2026-03-09T04:44:35.157Z",
  "url": "https://example.com/",
  "limit": 20
}
```

You can modify these values to suit your needs. Sensitive keys are stored in a `.env` file (see [.env.example](.env.example) for a template):
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `FIRECRAWL_API_KEY`

## Usage

### Server Setup (Node.js/Backend)

The server-side setup configures your AI provider and scrapes your website content into a local knowledge base (`ai-knowledge.md`). This knowledge base is used to provide context to the AI.

1.  **Run the setup command**:
    ```bash
    npx botcli-site setup
    ```
2.  **Select "Server-based (Node.js)"** when prompted.
3.  **Follow the interactive prompts** to configure your AI provider, enter your API keys, provide the URL of the website, and specify the number of pages to scrape.

Once complete, you'll have an `ai-knowledge.md` file ready to be used by the agent.

### Client Setup (React/Frontend)

The client-side setup provides pre-built React components that you can easily integrate into your frontend application.

1.  **Run the component command**:
    ```bash
    npx botcli-site component
    ```
2.  **Select the components** you want to add (e.g., Chat Widget, Sticky Button).
3.  The tool will create a `components/` directory in your project root containing the selected React components.

### Chat Command

To verify your setup and interact with your site's data via the CLI:

```bash
npx botcli-site chat
```

## Programmatic Usage

You can also use the core logic in your own Node.js backend. The function `askAgent` supports both string prompts and the `messages` array format used by the Vercel AI SDK.

```typescript
import { askAgent } from 'botcli-site';

// 1. Simple text response (supports string or message history)
const text = await askAgent("How do I contact support?");
console.log(text);
```

### Next.js Server Actions Example

You can use `askAgent` within Next.js Server Actions for a clean client-server integration:

**actions.ts (Server)**
```typescript
'use server';

import { askAgent } from 'botcli-site';

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
