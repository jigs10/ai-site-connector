import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

export async function getPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error("PINECONE_API_KEY is not set. Please provide it during setup or in your .env file.");
  }
  return new Pinecone({
    apiKey: apiKey,
  });
}

export async function uploadToPinecone(markdown: string, indexName: string) {
  const pc = await getPineconeClient();

  // 1. Create index if it doesn't exist
  const response = await pc.listIndexes();
  const indexExists = response.indexes?.some(idx => idx.name === indexName);

  if (!indexExists) {
    await pc.createIndexForModel({
      name: indexName,
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: 'llama-text-embed-v2',
        fieldMap: { text: 'chunk_text' },
      },
      waitUntilReady: true,
    });
  }

  const index = pc.index(indexName);

  // 2. More robust chunking logic
  const chunkText = (text: string, maxLen: number = 1000): string[] => {
    const chunks: string[] = [];
    const lines = text.split('\n');
    let currentChunk = "";

    for (const line of lines) {
      if ((currentChunk.length + line.length) > maxLen && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      currentChunk += line + "\n";
    }
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  };

  const textChunks = chunkText(markdown);
  
  if (textChunks.length === 0) {
    console.warn("No content found to upload to Pinecone.");
    return;
  }

  const records = textChunks.map((chunk, i) => ({
    _id: `chunk-${i}`,
    chunk_text: chunk,
    source: 'ai-knowledge.md'
  }));

  // 3. Upsert in batches (Pinecone integrated embedding limit is 96 records per batch)
  const batchSize = 50; 
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    // Based on the error "options.records is not iterable", it expects an object with a records property
    await index.upsertRecords({
      records: batch as any
    });
  }
}

export async function queryPinecone(query: string, indexName: string, topK: number = 3) {
  const pc = await getPineconeClient();
  const index = pc.index(indexName);

  // For indexes with integrated embedding, use searchRecords instead of query
  const queryResponse = await index.searchRecords({
    query: {
      topK,
      inputs: { text: query },
    },
    fields: ['chunk_text']
  });

  return queryResponse.result?.hits
    ?.map(hit => (hit.fields as any)?.chunk_text || '')
    .filter(text => text.length > 0)
    .join('\n\n---\n\n') || '';
}
