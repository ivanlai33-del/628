import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { GeneratedFile } from '../services/ai';

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
      className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-all backdrop-blur-md z-10 border border-slate-700/50"
      title="複製 628 DNA"
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
        <pre className="font-mono text-[11px] leading-relaxed text-slate-400 bg-slate-900/30 p-6 rounded-xl border border-white/5 overflow-x-auto selection:bg-slate-800 selection:text-slate-100">
          <code>{formattedJson}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="relative group">
      {copyButton}
      <div className="prose prose-invert prose-slate prose-sm max-w-none 
        prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-slate-200
        prose-p:text-slate-400 prose-p:leading-relaxed
        prose-li:text-slate-400
        prose-strong:text-slate-300
        prose-code:text-slate-300 prose-code:bg-slate-900/50 prose-code:px-1 prose-code:rounded
        prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/5">
        <Markdown>{file.content}</Markdown>
      </div>
    </div>
  );
}
