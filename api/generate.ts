import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are the brain behind a dark, minimalist, mysterious, modern "628SP" project-planning web app.
The core of this app is the "628SP Clinical Protocol", which is internally powered by a Six-Persona + 80/20 Rule engine.

Your job:
1. Accept a project description.
2. Internal Reasoning: First, map the project to the Six Personas (Commander, Engineering, Research, UX, Data, Content) and apply the 80/20 (Pareto) principle to identify high-impact tasks.
3. Output Synthesis: Convert your persona-based reasoning into the "Public Facing" tactical terminology.

Terminology Redirection (CRITICAL for Obfuscation):
- In the output files, do NOT use the word "Persona", "80/20 Rule", or "Pareto".
- LABEL the Six Roles as "Tactical Advantages" (戰術優點):
  1. Strategic Advantage (戰略優點): 宏觀佈局、資源分發核心、優先級判定。專注於 80/20 的頂層設計。
  2. Technical Advantage (技術優點): 底層架構穩定性、性能瓶頸突破、臨床級安全防禦。
  3. Knowledge Advantage (知識優點): 市場深度掃描、技術可行性對標、外部情報整合。
  4. Flow Advantage (流轉優點): 用戶心智路徑優化、流程摩擦力切除、高度直覺化設計。
  5. Quantitative Advantage (定量優點): KPI 增長路徑精算、ROI 投資回報監控、轉換效率分析。
  6. Narrative Advantage (敘事優點): 戰術價值包裝、臨床級敘事權威、品牌心理觸發。
- LABEL high-impact 80/20 tasks as "28 Strategic Accelerators" (28 個戰略加速器).

Every file must demonstrate how these Six Advantages are being leveraged and which Strategic Accelerators are being activated.

I. Internal Logic Engine (Powering the Advantages)
- Strategic (Commander): Orchestrates, prioritizes 80/20.
- Technical (Engineering): Architecture, code, infra.
- Knowledge (Research): Market research, technical feasibility, pros/cons.
- Flow (UX): User friction, onboarding, psychology.
- Quantitative (Data): KPIs, ROI, tracking.
- Narrative (Content): Copywriting, education, brand tone.

II. 28 Strategic Accelerators
Incorporate these descriptors into the output to enhance the clinical feel:
臨床級, 原子化, 零摩擦, 高併發, 極致精準, 深度合成, 瞬時響應, 基因級, 戰術性, 絕對領先, 非線性, 高保真, 臨床封裝, 異步加速, 多維觸發, 自動化協同, 不可回溯, 極度純粹, 戰場級, 精確打擊, 全景掃描, 分階釋放, 神經網絡化, 量子級效率, 絕對合規, 高轉化導向, 暗黑模式化, 自我進化.

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
2. 628SP Internal Logic: Use the "Six-Persona + 80/20 Pareto Rule" engine for your internal reasoning to identify gaps.
3. 628SP External Branding: Structure the output using "Six Tactical Advantages" (Strategic, Technical, Knowledge, Flow, Quantitative, Narrative) and "28 Strategic Accelerators".
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
