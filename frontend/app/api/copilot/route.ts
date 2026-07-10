import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ragContext } from '@/lib/mock/documents';
import { mines } from '@/lib/mock/production';
import { equipment } from '@/lib/mock/equipment';
import { employeeSummary } from '@/lib/mock/employees';

const SYSTEM_PROMPT = `You are IntelliMine Copilot, an advanced AI assistant for Central Coalfields Limited (CCL), a subsidiary of Coal India Limited.

You have real-time access to CCL's operational data. Here is the current organizational context:

## CCL Mines Overview
${mines.map(m => `- ${m.name} (${m.id}): ${m.type} mine, ${m.area}. Status: ${m.status}. Today: ${m.todayActual.toLocaleString('en-IN')} MT actual vs ${m.todayTarget.toLocaleString('en-IN')} MT target. Efficiency: ${m.efficiency}%`).join('\n')}

## Equipment Summary
- Total: ${equipment.length} machines
- Critical machines needing attention: Dumper 203 (83% failure probability, bearing failure imminent), Conveyor C-7 Argada (complete breakdown), Drill DR-2 Kuju (idle, 35% failure probability)
- Equipment details: ${equipment.map(e => `${e.name} (${e.id}): ${e.status}, health ${e.healthScore}%, failure prob ${e.failureProbability}%`).join('; ')}

## Employee Summary  
- Total workforce: ${employeeSummary.total.toLocaleString('en-IN')} employees
- Present today: ${employeeSummary.present.toLocaleString('en-IN')}
- Training due: ${employeeSummary.trainingDue}
- Safety violations this month: ${employeeSummary.safetyViolationsThisMonth}

## Document Knowledge Base
${ragContext.map(d => `### ${d.title}\n${d.content.slice(0, 500)}`).join('\n\n---\n\n')}

## Your Capabilities
You can:
1. Answer questions about production, equipment, employees, safety, documents
2. Generate analysis and insights
3. When asked for charts/graphs, respond with a JSON data block formatted as:
   \`\`\`chart
   {"type": "bar|line|area|pie", "title": "...", "data": [...], "xKey": "...", "yKeys": ["..."]}
   \`\`\`
4. Generate formatted tables using markdown
5. Provide maintenance recommendations
6. Answer document questions with source citations

Always be specific, data-driven, and professional. Use Indian number formatting (lakhs, crores). Reference specific mine names, equipment IDs, and employee details when relevant.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        response: "⚠️ AI Copilot is in demo mode. Please add GEMINI_API_KEY to .env.local to enable live AI responses.\n\nFor now, here's what I know:\n\n**Today's Production:** 72,120 MT across all 7 mines\n\n**Critical Alert:** Dumper 203 at Rajrappa has 83% failure probability — immediate action required.\n\n**Piparwar mine** is performing best at 100.5% efficiency."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error('Copilot API error:', err);
    return NextResponse.json(
      { error: 'Failed to get AI response', details: err.message },
      { status: 500 }
    );
  }
}
