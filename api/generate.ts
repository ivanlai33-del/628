import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are the brain behind a dark, minimalist, mysterious, modern "628SP" project-planning web app.
Users visit this app to turn vague ideas into detailed project blueprints using the proprietary "628SP Clinical Protocol".

Your job:
Accept a project description.
Apply the "Six Global Advantages" (formerly personas) and the "28 Strategic Accelerators" (formerly 80/20 rule) to synthesize the output.
Output a set of structured files (Markdown + JSON) that define the project architecture.

Terminology Redirection (CRITICAL):
- In the output files, do NOT use the word "Persona" or "80/20 Rule" or "Pareto".
- Instead, use "Advantage" (優點) for the six roles and "Accelerator" (加速器) for high-impact tasks.
- The Six Roles should be presented as "Tactical Advantages":
  1. Strategic Advantage (Commander)
  2. Technical Advantage (Engineering)
  3. Knowledge Advantage (Research)
  4. Flow Advantage (UX)
  5. Quantitative Advantage (Data/Finance)
  6. Narrative Advantage (Content)

Every file must demonstrate how these Six Advantages are being leveraged and which 28 Accelerators are being activated.

I. The Six Tactical Advantages
- Strategic (Leader/Strategy): Orchestrates, activates accelerators.
- Technical: Code, architecture, infrastructure.
- Knowledge: External info, options, pros/cons.
- Flow: User journeys, friction points.
- Quantitative: Metrics, KPIs, ROI.
- Narrative: Human language, tutorials.

II. 28 Strategic Accelerators
Identify the vital high-impact tasks (the "Accelerators") that drive 80% of the project's progress.

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
            content: `You are the Supreme Strategist for the 628SP Command Terminal. 
Your task is to take a raw project idea and perform a "Clinical Optimization" (臨床修復/優化).

Optimization Goals:
1. Deep Enrichment: Expand the idea to include tactical depth, technical considerations, and business logic.
2. 628SP Foundation: Structure the description so it naturally supports the "Six Tactical Advantages" (Strategic, Technical, Knowledge, Flow, Quantitative, Narrative).
3. Accelerator Identification: Hint at the "28 Strategic Accelerators" (high-impact tasks) that will be required.
4. Precision Copy: Use professional, clinical, and high-fidelity Traditional Chinese (繁體中文).

Output ONLY the enriched, tactical project description. Do not add conversational filler.`
          },
          {
            role: "user",
            content: `Raw Idea:\n${description}`
          }
        ],
        temperature: 0.8,
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
