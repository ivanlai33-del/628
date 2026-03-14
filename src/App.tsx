import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, Send, Terminal, Code2, Users, Layout, Database, BookOpen, Shield, Download, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import { generateProjectArchitecture, optimizeProjectDescription, GeneratedFile } from './services/ai';
import FileViewer from './components/FileViewer';

export default function App() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!description.trim()) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const optimized = await optimizeProjectDescription(description);
      setDescription(optimized);
    } catch (err) {
      setError(err instanceof Error ? err.message : '優化失敗，請稍後再試');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setFiles([]);
    setActiveFile(null);
    
    try {
      const generatedFiles = await generateProjectArchitecture(description);
      setFiles(generatedFiles);
      if (generatedFiles.length > 0) {
        setActiveFile(generatedFiles[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (files.length === 0) return;
    try {
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-architecture.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.json')) return <Code2 className="w-4 h-4" />;
    if (filename.includes('ROLE')) return <Users className="w-4 h-4" />;
    if (filename.includes('VIEWS')) return <Shield className="w-4 h-4" />;
    if (filename.includes('RULES')) return <Terminal className="w-4 h-4" />;
    if (filename.includes('TASKS')) return <Layout className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>
            <h1 className="font-medium tracking-tight text-slate-100">六角色專案架構師</h1>
          </div>
          <div className="text-xs font-mono text-slate-500">v1.0.0 // 80:20</div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="space-y-2 flex-shrink-0">
            <h2 className="text-sm font-medium text-slate-200">專案定義</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              請描述您的專案。架構師將應用六大角色與 80/20 法則，為您生成結構化的專案庫。
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-4 min-h-[300px]">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：一個使用本地優先儲存並透過 CRDT 同步的極簡習慣追蹤器..."
              className="flex-1 w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 transition-all resize-none"
              disabled={isGenerating || isOptimizing}
            />
            <div className="flex items-center justify-between flex-shrink-0">
              <button
                onClick={handleOptimize}
                disabled={isGenerating || isOptimizing || !description.trim()}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOptimizing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Ai智能優化</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isOptimizing || !description.trim()}
                className="flex items-center gap-2 bg-slate-700 text-slate-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(51,65,85,0.5)] hover:shadow-[0_0_20px_rgba(71,85,105,0.6)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>架構生成中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>開始生成</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg text-xs text-red-400 flex-shrink-0">
              {error}
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-slate-800/50 flex-shrink-0">
            <h3 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">六大角色 (The Six Personas)</h3>
            <div className="grid grid-cols-2 gap-2">
              {['指揮官 (Commander)', '工程 (Engineering)', '研究 (Research)', '體驗/流程 (UX/Flow)', '數據/財務 (Data/Finance)', '內容 (Content)'].map((persona) => (
                <div key={persona} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  {persona}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          {files.length === 0 && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
              <Terminal className="w-8 h-8 text-slate-700 mb-4" />
              <p className="text-sm text-slate-500">等待輸入專案定義...</p>
            </div>
          ) : isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-slate-800 rounded-lg bg-slate-900/20">
              <Loader2 className="w-8 h-8 text-slate-600 animate-spin mb-4" />
              <p className="text-sm text-slate-400 font-mono animate-pulse">正在合成專案架構...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col border border-slate-800 rounded-lg bg-slate-950 overflow-hidden shadow-2xl shadow-black/50">
              {/* File Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setActiveFile(file.name)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-mono whitespace-nowrap border-r border-slate-800 transition-all ${
                        activeFile === file.name
                          ? 'bg-slate-950 text-slate-100 border-b-transparent shadow-[inset_0_2px_0_0_rgba(255,255,255,0.1)]'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {getFileIcon(file.name)}
                      {file.name}
                    </button>
                  ))}
                </div>
                <div className="px-4 flex-shrink-0">
                  <button
                    onClick={handleDownloadZip}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-slate-100 rounded transition-colors"
                    title="下載 ZIP 壓縮檔"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下載全部</span>
                  </button>
                </div>
              </div>
              
              {/* File Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                <AnimatePresence mode="wait">
                  {files.map((file) => 
                    activeFile === file.name && (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FileViewer file={file} />
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
