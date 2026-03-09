# AI Site Connector

The AI Site Connector is a command-line interface (CLI) tool designed to interact with AI models and scrape website content. It provides functionalities for setting up your environment, configuring AI models and data sources, and engaging in chat-based interactions with the configured AI.

## Features

*   **Flexible AI Model Integration**: Supports various AI SDKs (Anthropic, Google, OpenAI) allowing you to switch between different AI providers.
*   **Website Content Scraping**: Utilizes `firecrawl-js` for efficient and effective scraping of website content, which can then be used as context for AI interactions.
*   **Interactive Chat**: Engage in a conversational loop with your selected AI model, leveraging scraped data for more informed responses.
*   **Easy Setup**: A straightforward setup process to get your AI connector running quickly.

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

## Configuration

The `ai-site.config.json` file is used to configure the AI model, provider, and the target URL for scraping. An example configuration looks like this:

```json
{
  "model": "gemini-2.0-flash-exp",
  "provider": "google",
  "updatedAt": "2026-03-09T04:44:35.157Z",
  "url": "https://example.com/"
}
```

You can modify these values to suit your needs.

## Usage

### Setup Command

The `setup` command guides you through the initial configuration of the AI Site Connector. If no command is specified, `setup` is run by default.

```bash
npx ai-site-connector setup
# or simply
npx ai-site-connector
```

### Chat Command

The `chat` command starts an interactive chat session with your configured AI model.

```bash
npx ai-site-connector chat
```

## Development

For developers contributing to `ai-site-connector`, the `dev` script provides a convenient way to run the CLI directly from its TypeScript source code without requiring a prior build step. This is ideal for active development, debugging, and testing changes quickly.

```bash
npm run dev
```

This command executes `src/bin.ts` using `ts-node`, enabling a faster development cycle by bypassing the compilation process (`npm run build`).
