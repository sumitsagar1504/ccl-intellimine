import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ragContext } from '@/lib/mock/documents';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Demo fallback
      const ctx = ragContext.find(d => d.content.toLowerCase().includes(query.toLowerCase().split(' ').find((w: string) => w.length > 4) || ''));
      return NextResponse.json({
        answer: ctx
          ? `Based on **${ctx.title}**:\n\n${ctx.content.slice(0, 800)}...\n\n> *Source: ${ctx.title}*`
          : `⚠️ No API key configured. Add GEMINI_API_KEY to .env.local for live AI document search.\n\nSearched in ${ragContext.length} documents for: "${query}"`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const context = ragContext.map(d => `### ${d.title}\n\n${d.content}`).join('\n\n---\n\n');

    const prompt = `You are a document intelligence assistant for Central Coalfields Limited (CCL). 
    
You have access to the following documents from CCL's document library:

${context}

User Question: "${query}"

Instructions:
1. Answer the question based ONLY on the documents provided above
2. Always cite the specific document title and section/page where you found the answer
3. If the answer is not in the documents, say so clearly
4. Be specific and quote relevant text
5. Format your response with:
   - A direct answer first
   - Supporting evidence with quotes
   - Source citation in the format: > *Source: [Document Title]*

Answer:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ error: 'Search failed', details: err.message }, { status: 500 });
  }
}
