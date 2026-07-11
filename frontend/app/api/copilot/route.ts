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
- Critical: Dumper 203 (83% failure probability, bearing failure imminent), Conveyor C-7 Argada (complete breakdown), Drill DR-2 Kuju (idle, 35% failure probability)
- Equipment details: ${equipment.map(e => `${e.name} (${e.id}): ${e.status}, health ${e.healthScore}%, failure prob ${e.failureProbability}%`).join('; ')}

## Employee Summary  
- Total workforce: ${employeeSummary.total.toLocaleString('en-IN')} employees
- Present today: ${employeeSummary.present.toLocaleString('en-IN')}
- Training due: ${employeeSummary.trainingDue}
- Safety violations this month: ${employeeSummary.safetyViolationsThisMonth}

## Document Knowledge Base
${ragContext.map(d => `### ${d.title}\n${d.content.slice(0, 500)}`).join('\n\n---\n\n')}

## Your Capabilities
1. Answer questions about production, equipment, employees, safety, documents
2. Generate analysis and insights
3. When asked for charts/graphs, respond with a JSON data block:
   \`\`\`chart
   {"type": "bar|line|area|pie", "title": "...", "data": [...], "xKey": "...", "yKeys": ["..."]}
   \`\`\`
4. Generate formatted markdown tables
5. Provide maintenance recommendations and safety guidance
6. Answer document questions with source citations

Always be specific, data-driven, and professional. Use Indian number formatting (lakhs, crores). Reference specific mine names, equipment IDs, and employee details when relevant.`;

// Ordered list of models to try (newest first, fallbacks after)
const MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro',
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // No key or placeholder — return rich demo response
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      const lastQuery = messages[messages.length - 1]?.content?.toLowerCase() ?? '';
      return NextResponse.json({ response: getDemoResponse(lastQuery) });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    // Try each model until one works
    let lastError: Error | null = null;
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          history,
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        });
        const result = await chat.sendMessage(lastMessage);
        const text = result.response.text();
        return NextResponse.json({ response: text, model: modelName });
      } catch (e: any) {
        lastError = e;
        // If it's a 404/model-not-found error, try next model
        if (e?.message?.includes('404') || e?.message?.includes('not found') || e?.status === 404) {
          continue;
        }
        // Any other error (auth, quota, etc.) — throw immediately
        throw e;
      }
    }

    // All models failed — return demo with the actual error
    throw lastError ?? new Error('All Gemini models failed');

  } catch (err: any) {
    console.error('Copilot API error:', err);

    // Better error messages for common failures
    let friendlyMessage = 'AI response failed.';
    const msg = err?.message ?? '';

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      friendlyMessage = '🔑 **Invalid API Key** — Your Gemini API key is not valid.\n\n**Fix:** Go to [aistudio.google.com](https://aistudio.google.com), generate a new key, and paste it into `frontend/.env.local` as `GEMINI_API_KEY=AIza...`\n\nThen restart the dev server.';
    } else if (msg.includes('QUOTA') || msg.includes('quota') || msg.includes('429')) {
      friendlyMessage = '⏳ **Rate limit reached** — Free Gemini quota hit for this minute.\n\nWait 60 seconds and try again. The free tier allows 15 requests/minute.';
    } else if (msg.includes('PERMISSION') || msg.includes('403')) {
      friendlyMessage = '🚫 **Permission denied** — The API key may not have Gemini API enabled.\n\nGo to [console.cloud.google.com](https://console.cloud.google.com) and enable the **Generative Language API**.';
    } else {
      friendlyMessage = `⚠️ **Error:** ${msg || 'Unknown error'}\n\nCheck the browser console (F12) for more details.`;
    }

    return NextResponse.json(
      { response: friendlyMessage },
      { status: 200 } // Return 200 so the chat shows the message instead of crashing
    );
  }
}

function getDemoResponse(query: string): string {
  // Match query keywords and return contextual mock responses
  if (query.includes('production') || query.includes('mine') || query.includes('rajrappa')) {
    return `## Production Summary — Rajrappa Mine

| Metric | Value |
|--------|-------|
| Today's Actual | 14,200 MT |
| Today's Target | 15,000 MT |
| Efficiency | 94.7% |
| Month-to-date | 3,12,400 MT |
| Month Target | 3,30,000 MT |

**Shift Performance:**
- **A Shift:** 5,400 MT ✅ (108% of shift target)
- **B Shift:** 4,800 MT ⚠️ (96% of target — equipment delay)
- **C Shift:** 4,000 MT ✅ (in progress)

**Key Issue:** Excavator EX-001 was offline for 2 hours in B Shift due to hydraulic pressure drop. Back in service at 14:30.

> 💡 *Enable Gemini AI for live analysis, trend forecasting, and natural language queries across all data.*`;
  }

  if (query.includes('equipment') || query.includes('excavator') || query.includes('dumper') || query.includes('downtime')) {
    return `## Equipment Health & Downtime Analysis

### 🔴 Critical — Immediate Action Required
- **Dumper 203** (Rajrappa) — 83% failure probability. Bearing vibration at 12.4 mm/s (limit: 7.1 mm/s). **Remove from service immediately.**

### ⚠️ High Priority
- **Conveyor C-7** (Argada) — Complete breakdown. Belt tear detected. Estimated repair: 6–8 hours.
- **Drill DR-2** (Kuju) — Idle, 35% failure probability. Overdue for scheduled maintenance.

### Downtime Leaders (This Month)
| Equipment | Mine | Downtime Hours | Reason |
|-----------|------|----------------|--------|
| Dumper 203 | Rajrappa | 18.5 hrs | Bearing wear |
| Conv. C-7 | Argada | 14.2 hrs | Belt damage |
| EX-003 | Piparwar | 8.0 hrs | Scheduled maint. |

> 💡 *Add your Gemini API key to get predictive failure analysis and AI-generated maintenance schedules.*`;
  }

  if (query.includes('employee') || query.includes('worker') || query.includes('training') || query.includes('safety')) {
    return `## Workforce Intelligence Summary

**Present Today:** 4,210 / 4,820 (87.3% attendance)
**On Leave:** 380 | **Absent:** 230

### Training & Compliance
- **184 employees** have training certifications due within 30 days
- **23 employees** are overdue (require immediate attention)
- Departments with highest overdue: Mechanical (8), Operations (7), Electrical (5)

### Safety This Month
- Total incidents: **5** (down from 8 last month ✅ −37.5%)
- PPE violations: **12** (Rajrappa: 7, Kuju: 5)
- Near misses reported: **3** (all investigated, closed)

### Attendance by Mine
| Mine | Present | On Leave | Absent |
|------|---------|----------|--------|
| Rajrappa | 1,180 | 90 | 45 |
| Piparwar | 820 | 60 | 30 |
| Argada | 640 | 80 | 40 |

> 💡 *Connect Gemini AI to get employee-level insights, training gap analysis, and HR recommendations.*`;
  }

  if (query.includes('fuel') || query.includes('consumption')) {
    return `## Fuel Consumption Analysis — Last 6 Months

| Month | Consumption (KL) | Cost (₹ Lakh) | Efficiency |
|-------|-----------------|---------------|------------|
| Feb | 142.3 | 18.2 | 94% |
| Mar | 138.7 | 17.7 | 96% |
| Apr | 145.1 | 18.6 | 93% |
| May | 139.4 | 17.8 | 95% |
| Jun | 141.8 | 18.1 | 94% |
| Jul | 136.2 | 17.4 | 97% |

📉 **Trend:** −4.2% consumption vs 6-month average — excellent progress!

**Highest consumers:** Dumper fleet (48%), Excavators (32%), Drill rigs (12%)

> 💡 *Add Gemini API key to ask follow-up questions like "Which dumper wastes the most fuel?" or "Forecast August consumption."*`;
  }

  // Default demo response
  return `## IntelliMine Copilot — Demo Mode

I'm running in **demo mode** because no Gemini API key is configured yet.

In this mode, I can show you pre-loaded data for common queries. Try asking:
- *"Show production of Rajrappa mine"*
- *"Which excavator has highest downtime?"*
- *"Which employees need safety retraining?"*
- *"Show fuel consumption trend"*

### To Enable Full AI
1. Go to **[aistudio.google.com](https://aistudio.google.com)**
2. Click **"Get API Key"** → Create API Key
3. Open \`frontend/.env.local\`
4. Replace \`your_gemini_api_key_here\` with your key: \`GEMINI_API_KEY=AIza...\`
5. **Restart the dev server** (\`npm run dev\`)

The key is **free** — 15 requests/minute, no credit card needed. 🎉`;
}
