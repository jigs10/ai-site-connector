import * as p from "@clack/prompts";
import color from "picocolors";
import fs from "node:fs";
import path from "node:path";

const chatWidgetTemplate = `
// components/ChatWidget.tsx
import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg"
      >
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="p-4 border-b border-gray-200">Chat with us!</div>
          <div className="flex-grow p-4 overflow-y-auto">{/* Chat messages will go here */}</div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
`;

const stickyButtonTemplate = `
// components/StickyButton.tsx
import React from 'react';

interface StickyButtonProps {
  onClick: () => void;
  label: string;
}

const StickyButton: React.FC<StickyButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 bg-green-500 text-white rounded-full p-4 shadow-lg"
    >
      {label}
    </button>
  );
};

export default StickyButton;
`;

export async function componentCommand() {
  p.intro(color.bgMagenta(color.black(" Bot4site - Components ")));

  const project = await p.group(
    {
      action: () =>
        p.select({
          message: "What do you want to do?",
          options: [
            { value: "add", label: "Add a component" },
            { value: "remove", label: "Remove a component" },
          ],
        }),
      component: ({ results }) =>
        p.multiselect({
          message: `Which component(s) do you want to ${results.action}?`,
          options: [
            { value: "chat-widget", label: "Chat Widget" },
            { value: "sticky-button", label: "Sticky Button" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation aborted.");
        process.exit(0);
      },
    }
  );

  p.log.info(`You chose to ${project.action} the following components: ${(project.component as string[]).join(", ")}.`);

  const componentsDir = path.join(process.cwd(), 'components');

  if (project.action === 'add') {
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    for (const component of project.component as string[]) {
      let componentName = '';
      let componentContent = '';
      let fileName = '';

      if (component === 'chat-widget') {
        componentName = 'ChatWidget';
        fileName = 'ChatWidget.tsx';
        componentContent = chatWidgetTemplate;
      } else if (component === 'sticky-button') {
        componentName = 'StickyButton';
        fileName = 'StickyButton.tsx';
        componentContent = stickyButtonTemplate;
      }

      const filePath = path.join(componentsDir, fileName);

      fs.writeFileSync(filePath, componentContent);
      p.log.success(color.green(`Added ${componentName} to ${filePath}`));
      p.note(
        `To use the ${componentName}, import it into your desired page or layout file (e.g., _app.tsx or layout.tsx) and render it.\n\nExample: \nimport ${componentName} from './components/${componentName}';\n\nfunction MyApp({ Component, pageProps }) {\n  return (\n    <>\n      <Component {...pageProps} />\n      <${componentName} />\n    </>\n  );\n}`,
        'Next Steps'
      );
    }
  } else if (project.action === 'remove') {
    for (const component of project.component as string[]) {
      let componentName = '';
      let fileName = '';

      if (component === 'chat-widget') {
        componentName = 'ChatWidget';
        fileName = 'ChatWidget.tsx';
      } else if (component === 'sticky-button') {
        componentName = 'StickyButton';
        fileName = 'StickyButton.tsx';
      }

      const filePath = path.join(componentsDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        p.log.success(color.green(`Removed ${componentName} from ${filePath}`));
        p.note(
          `Remember to remove any import statements and usage of the ${componentName} from your application code.`,
          'Next Steps'
        );
      } else {
        p.log.info(color.dim(`${componentName} not found at ${filePath}. Nothing to remove.`));
      }
    }
  }
}
