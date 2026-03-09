# AI Site Connector 🚀

Seamlessly connect AI chat bots to your website. This CLI tool automates website scraping for context and provides ready-to-use React components.

[![npm version](https://img.shields.io/npm/v/ai-site-connector.svg)](https://www.npmjs.com/package/ai-site-connector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The AI Site Connector is a command-line interface (CLI) tool designed to interact with AI models and scrape website content. It provides functionalities for setting up your environment, configuring AI models and data sources, and engaging in chat-based interactions with the configured AI.

## Features

*   **🤖 Multi-Provider Support**: Works with OpenAI (GPT-5.4), Google (Gemini 3.1), and Anthropic (Claude 4.6).
*   **🌐 Smart Scraping**: Powered by Firecrawl to turn any website into a clean Markdown knowledge base.
*   **🧩 React Components**: Instant UI components (Chat Widget, Sticky Button) for your frontend.
*   **💬 CLI Chat**: Test your AI agent directly in the terminal before deploying.
*   **🛠 Easy Setup**: A straightforward setup process to get your AI connector running quickly.

## Installation

To use the AI Site Connector, you need to have Node.js and npm installed.

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
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
npx ai-site-connector setup
```

## Configuration

The `ai-site.config.json` file is used to configure the AI model, provider, and the target URL for scraping. An example configuration looks like this:

```json
{
  "model": "gemini-3.1-flash-lite",
  "provider": "google",
  "updatedAt": "2026-03-09T04:44:35.157Z",
  "url": "https://example.com/"
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
    npx ai-site-connector setup
    ```
2.  **Select "Server-based (Node.js)"** when prompted.
3.  **Follow the interactive prompts** to configure your AI provider, enter your API keys, and provide the URL of the website you want to scrape.

Once complete, you'll have an `ai-knowledge.md` file ready to be used by the agent.

### Client Setup (React/Frontend)

The client-side setup provides pre-built React components that you can easily integrate into your frontend application.

1.  **Run the component command**:
    ```bash
    npx ai-site-connector component
    ```
2.  **Select the components** you want to add (e.g., Chat Widget, Sticky Button).
3.  The tool will create a `components/` directory in your project root containing the selected React components.

### Chat Command

To verify your setup and interact with your site's data via the CLI:

```bash
npx ai-site-connector chat
```

## Programmatic Usage

You can also use the core logic in your own Node.js backend:

```typescript
import { streamAgent } from 'ai-site-connector';

const response = await streamAgent("How do I contact support?");
// ... handle stream
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
