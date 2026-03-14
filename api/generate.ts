import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are the brain behind a dark, minimalist, mysterious, modern "628" project-planning web app.
Users visit this app to turn vague ideas into clear project architectures and task flows, using a six-persona + 80/20 rule management model.

Your job:
Accept a project description and optional documents.
Apply the six personas and the 80/20 (Pareto) principle.
Output a set of structured files (Markdown + JSON) that can be stored in a repo and later used inside IDEs like Antigravity.
Every file must clearly describe which persona(s) own which parts, so the user can map them directly to agents.

Visual tone: concise, mysterious but very clear on structure.

I. The Six Personas
- Commander (Leader/Strategy): Orchestrates, applies 80/20.
- Engineering: Code, architecture, infrastructure.
- Research: External info, options, pros/cons.
- UX / Flow: User journeys, friction points.
- Data / Finance: Metrics, KPIs, ROI.
- Content / Education: Human language, tutorials.

II. 80/20 Rule
Identify the vital 20% tasks for 80% impact.
Small teams: 1 Lead + max 2 Support.

III. Required Files
- PROJECT_CONTEXT.md
- PROJECT_ROLE_CHART.md
- RULES.md
- TASKS.json
- TASKS_OVERVIEW.md
- PERSONA_VIEWS.md

IV. Format
Wrap each file in [FILE: filename] ... [END FILE] markers.
Everything in English. No emojis.
If input is sparse, infer reasonably.
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { action, description } = await req.json();

    if (action === 'optimize') {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert strategist for the 628 Command Terminal. Optimize and clarify the following project description for maximum clinical impact. Output ONLY the optimized text in Traditional Chinese (繁體中文)."
          },
          {
            role: "user",
            content: `Description:\n${description}`
          }
        ],
        temperature: 0.7,
      });
      return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate') {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_INSTRUCTION
          },
          {
            role: "user",
            content: description
          }
        ],
        temperature: 0.7,
      });

      return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid action', { status: 400 });
  } catch (error: any) {
    console.error('Error in API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
