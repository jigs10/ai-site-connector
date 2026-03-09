import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
dotenv.config();

export async function scrapeToMarkdown(url: string, limit: number = 20): Promise<string> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY || '';
  const app = new FirecrawlApp({ 
    apiKey: firecrawlKey
  });
  
  try {
    // .crawl() is the modern 'waiter' method.
    // It returns a result object once the crawl is finished.
    const result: any = await app.crawl(url, {
      limit: limit,
      scrapeOptions: {
        formats: ['markdown'],
      }
    });

    // Instead of checking .success, we check if we actually got data back.
    // result.data is an array of the scraped pages.
    if (!result || !result.data || result.data.length === 0) {
      // If there's an error message in the status, we throw that.
      const errorMsg = result.error || 'No pages discovered or crawl failed.';
      throw new Error(errorMsg);
    }

    // Combine all pages into one string
    const combinedMarkdown = result.data
      .map((page: any) => {
        const source = page.metadata?.sourceURL || page.url || 'Unknown Source';
        return `--- PAGE START: ${source} ---\n${page.markdown}\n--- PAGE END ---\n`;
      })
      .join('\n\n');

    return combinedMarkdown;
  } catch (error: any) {
    throw new Error(`Firecrawl Error: ${error.message || 'Unknown error during crawl'}`);
  }
}