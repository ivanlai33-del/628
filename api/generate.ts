import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { action, description, systemInstruction } = await req.json();

    if (action === 'optimize') {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert project manager and software architect. Please optimize, structure, and elaborate on the following project description to make it more comprehensive, clear, and professional. Output ONLY the optimized text in Traditional Chinese (繁體中文), without any conversational filler or markdown code blocks wrapping the whole response."
          },
          {
            role: "user",
            content: `Original Description:\n${description}`
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
            content: systemInstruction
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
