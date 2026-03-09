import { streamAgent } from './src/agent.js';

async function test() {
  console.log("🤖 Agent is thinking...");
  
  const result = await streamAgent("What is this website about?");

  // This is how you test a stream in the terminal
  for await (const delta of result.textStream) {
    process.stdout.write(delta); 
  }
  
  console.log("\n\n✅ Stream finished.");
}

test().catch(console.error);