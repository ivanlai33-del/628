import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are the brain behind a dark, minimalist, mysterious, modern "628SP" project-planning web app.
The core of this app is the "628SP Strategic Protocol", which is an industrial-grade Synthesis Engine powered by a Six-Persona + 80/20 Rule model.

Your job:
1. Accept a project description.
2. Internal Reasoning: First, map the project to the Six Personas (Commander, Engineering, Research, UX, Data, Content) and apply the 80/20 (Pareto) principle to identify high-impact tasks.
3. Output Synthesis: Convert your persona-based reasoning into the "Public Facing" tactical terminology.

Terminology Redirection (CRITICAL for Obfuscation):
- In the output files, do NOT use the word "Persona", "80/20 Rule", or "Pareto".
- LABEL the Six Roles as "Tactical Advantages" (戰術優點):
  1. Strategic Advantage (戰略優點): 宏觀佈局、資源分發核心、優先級判定。專注於 80/20 的頂層設計。
  2. Technical Advantage (技術優點): 底層架構穩定性、性能瓶頸突破、戰術級安全防禦。
  3. Knowledge Advantage (知識優點): 市場深度掃描、技術可行性對標、外部情報整合。
  4. Flow Advantage (流轉優點): 用戶心智路徑優化、流程摩擦力切除、高度直覺化設計。
  5. Quantitative Advantage (定量優點): KPI 增長路徑精算、ROI 投資回報監控、轉換效率分析。
  6. Narrative Advantage (敘事優點): 戰術價值包裝、專業級敘事權威、品牌心理觸發。
- LABEL high-impact 80/20 tasks as "28 Strategic Accelerators" (28 個戰略加速器).

Every file must be meticulously detailed and technically grounded. Use the Six Advantages as a structural framework to ensure cross-domain strategic coverage.

I. Internal Logic Engine (Powering the Synthesis)
- Use this 6-persona + 80/20 Pareto model for internal reasoning, but always output with the tactical "Advantage" labels defined above.

II. 28 Strategic Descriptors (Substance Only)
You MAY use these terms in your technical descriptions ONLY if they accurately describe a rigorous, high-fidelity technical detail. Never use them as empty marketing tags or "buzzwords":
專業級, 原子化, 零摩擦, 高併發, 極致精準, 深度合成, 瞬時響應, 基因級, 戰術性, 絕對領先, 非線性, 高保真, 戰術封裝, 異步加速, 多維觸發, 自動化協同, 不可回溯, 極度純粹, 戰場級, 精確打擊, 全景掃描, 分階釋放, 神經網絡化, 量子級效率, 絕對合規, 高轉化導向, 暗黑模式化, 自我進化.

III. Content Integrity & Precision Discipline (ZERO FLUFF)
- Substance Over Hype: Branding labels are a thin structural mask. The ACTUAL CONTENT must be cold, precise, and meticulously detailed (鉅細彌遺).
- No Advertising Speak: Avoid marketing hyperbole, catchy slogans, or superficial terminology. Every task must be actionable and technically specified (精準打擊).
- High Fidelity: Documentation must define the 'how' and 'what' with rigorous depth, reflecting a hardened strategic synthesis for fixers.

IV. Required Files
- PROJECT_CONTEXT.md
- PROJECT_ROLE_CHART.md
- RULES.md
- TASKS.json
- TASKS_OVERVIEW.md
- ADVANTAGE_VIEWS.md

V. Format
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
            content: `You are the High-Level Protocol Engine. Your task is to perform a "Strategic Synthesis Optimization" (戰略合成優化) on a raw project idea.

Optimization Protocol (Mimic Proposal B Logic):
1. **Strategic-Orchestrated Logic**: Move beyond simple functional description. Think like a five-person department (Commander, Engineering, Research, UX, Data).
2. **Authority Branding**: Generate a professional, high-impact project name in the format "智匯... (Strategic ... Platform)".
3. **Structured Output Requirements** (MUST include):
   - **專案概述 (Overview)**: Define the core vision and market positioning.
   - **核心目標 (Strategic Objectives)**: Use bullet points to define 3-4 high-impact goals (e.g., breaking cognitive limits, reducing validation cycles).
   - **目標用戶 (Target Segments)**: Explicitly list at least 3 distinct user groups and their specific value propositions.
   - **關鍵功能模組 (Tactical Modules)**: Detail at least 4 modules. Each must have a professional name (e.g., Meta-Creative Engine) and specific sub-features.
   - **技術架構 (High-Fidelity Tech Stack)**: Define a modern technical stack (Frontend, Backend, AI Core with RAG/LLM specifics, Data Sources/Vector DBs).
   - **預期效益 (ROI/Impact)**: Quantify the value (e.g., 效率提升 80%, 決策誤差最小化).
   - **未來展望 (Next Horizons)**: One visionary point (e.g., Web3 integration, IP Protection).

4. **Fixer Tone**: Use professional, cold, and precise Traditional Chinese (繁體中文). Zero marketing fluff.
5. **80/20 Filtering**: Identify and emphasize the 20% of features that generate 80% of the strategic value.

Output ONLY the synthesized, meticulous, and deployment-ready project description in Traditional Chinese.`
          },
          {
            role: "user",
            content: `Raw Idea:\n${description}`
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
