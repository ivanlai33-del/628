import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { GeneratedFile } from '../services/gemini';

interface FileViewerProps {
  file: GeneratedFile;
}

export default function FileViewer({ file }: FileViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyButton = (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-colors backdrop-blur-sm"
      title="複製到剪貼簿"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  if (file.name.endsWith('.json')) {
    let formattedJson = file.content;
    try {
      const parsed = JSON.parse(file.content);
      formattedJson = JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If it's not valid JSON, just show the raw content
    }

    return (
      <div className="relative group">
        {copyButton}
        <pre className="font-mono text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 overflow-x-auto">
          <code>{formattedJson}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="relative group">
      {copyButton}
      <div className="markdown-body">
        <Markdown>{file.content}</Markdown>
      </div>
    </div>
  );
}
