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

### Server Setup (Node.js/Backend)

The server-side setup configures your AI provider and scrapes your website content into a local knowledge base (`ai-knowledge.md`). This knowledge base is used to provide context to the AI.

1.  **Run the setup command**:
    ```bash
    npx ai-site-connector setup
    ```
2.  **Select "Server-based (Node.js)"** when prompted.
3.  **Follow the interactive prompts** to configure your AI provider (OpenAI, Google, or Anthropic), enter your API keys, and provide the URL of the website you want to scrape.

Once complete, you'll have an `ai-knowledge.md` file ready to be used by the agent.

### Client Setup (React/Frontend)

The client-side setup provides pre-built React components that you can easily integrate into your frontend application.

1.  **Run the component command**:
    ```bash
    npx ai-site-connector component
    # or select "Client-based" in the setup command
    ```
2.  **Select the components** you want to add (e.g., Chat Widget, Sticky Button).
3.  The tool will create a `components/` directory in your project root containing the selected React components.

### Chat Command

To verify your setup and interact with your site's data via the CLI:

```bash
npx ai-site-connector chat
```

## Development

For developers contributing to `ai-site-connector`, the `dev` script provides a convenient way to run the CLI directly from its TypeScript source code without requiring a prior build step. This is ideal for active development, debugging, and testing changes quickly.

```bash
npm run dev
```

This command executes `src/bin.ts` using `ts-node`, enabling a faster development cycle by bypassing the compilation process (`npm run build`).
