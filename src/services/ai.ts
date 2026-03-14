export interface GeneratedFile {
  name: string;
  content: string;
}

async function callApi(action: string, data: any) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
}

export async function optimizeProjectDescription(description: string): Promise<string> {
  const result = await callApi('optimize', { description });
  return result.text || description;
}

export async function generateProjectArchitecture(description: string): Promise<GeneratedFile[]> {
  const result = await callApi('generate', { description });
  
  if (!result.text) {
    throw new Error("No response generated");
  }

  return parseFiles(result.text);
}

function parseFiles(text: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const regex = /\[FILE:\s*(.+?)\]([\s\S]*?)\[END FILE\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    files.push({
      name: match[1].trim(),
      content: match[2].trim(),
    });
  }

  return files;
}
