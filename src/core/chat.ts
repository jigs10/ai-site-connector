import * as p from '@clack/prompts';
import color from 'picocolors';
import { askAgent } from './agent.js';

export async function chatLoop() {
  p.intro(color.bgMagenta(color.black(' AI Site Chat ')));
  
  // We keep a simple history array to give the AI "memory"
  const history: { role: 'user' | 'assistant', content: string }[] = [];

  while (true) {
    const question = await p.text({
      message: 'Ask something about the site:',
      placeholder: 'e.g., What are the main features?',
      validate: (v) => (!v ? 'Please enter a question' : undefined)
    });

    if (p.isCancel(question) || question === 'exit') {
      p.outro(color.yellow('Chat ended. Goodbye!'));
      break;
    }

    const s = p.spinner();
    s.start('Thinking...');

    try {
      // Pass the messages history to your multi-model agent
      const messages = [
        ...history,
        { role: 'user' as const, content: question }
      ];
      const answer = await askAgent(messages);
      s.stop('Answered:');
      
      // Print the answer with a nice border
      p.note(answer, 'AI Response');
      
      history.push({ role: 'user', content: question });
      history.push({ role: 'assistant', content: answer });
    } catch (err: any) {
      s.stop('Error');
      p.log.error(err.message);
    }
  }
}

// Only run if this is the main module
if (import.meta.url.endsWith(process.argv[1])) {
  chatLoop();
}
