import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, Send, Terminal, Code2, Users, Layout, Database, BookOpen, Shield, Download, Sparkles, BarChart3, Target, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { generateProjectArchitecture, optimizeProjectDescription, GeneratedFile } from './services/ai';
import FileViewer from './components/FileViewer';

export default function App() {
  const [description, setDescription] = useState('');
  const [displayDescription, setDisplayDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Typewriter effect for optimized description
  const typeText = (text: string) => {
    let i = 0;
    setDisplayDescription('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayDescription((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 10);
  };

  useEffect(() => {
    setDisplayDescription(description);
  }, [description && !isOptimizing]);

  const handleOptimize = async () => {
    if (!description.trim()) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const optimized = await optimizeProjectDescription(description);
      setDescription(optimized);
      typeText(optimized);
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
    <div className="min-h-screen flex flex-col selection:bg-slate-800 selection:text-slate-100">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-inner">
              <Terminal className="w-4 h-4 text-emerald-500/80" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight text-slate-100 text-sm">628SP 戰略指揮終端</h1>
              <div className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase">Clinical Command Center</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Protocol Engine Active</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>v2.1-IP-Obscured</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">戰術目標輸入 (Tactical Objective)</h2>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              請在此輸入您的專案願景。指揮中心將掛載 628SP 臨床基因，透過六大戰術優點與 28 個戰略加速器進行深度合成。
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-5 min-h-[350px]">
            <div className="relative flex-1 group">
              <textarea
                value={isOptimizing ? displayDescription : description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：構建一個具備高度自動化的 AI 跨境電商引擎..."
                className="w-full h-full bg-slate-900/20 border border-white/5 rounded-xl p-5 text-[13px] text-slate-400 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all resize-none leading-relaxed font-mono custom-scrollbar"
                disabled={isGenerating || isOptimizing}
              />
              {isOptimizing && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center rounded-xl pointer-events-none">
                  <div className="flex items-center gap-2 text-emerald-500/80 text-[10px] font-mono tracking-widest uppercase">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Clinical Optimizing...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOptimize}
                disabled={isGenerating || isOptimizing || !description.trim()}
                className="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400/80 bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 py-3 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>628SP 臨床修復/優化</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isOptimizing || !description.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 py-3 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-emerald-500/5 active:scale-[0.98] disabled:opacity-30"
              >
                {isGenerating ? (
                   <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>合成 628SP 戰術架構</span>
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-[11px] text-red-400 font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Analytics Dashboard */}
          <div className="space-y-4 pt-6 mt-auto border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              <BarChart3 className="w-3 h-3" />
              80/20 Clinical Analytics
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Role Alignment', value: '100%', icon: <Users className="w-3 h-3" /> },
                { label: 'Token Efficiency', value: '+85%', icon: <Zap className="w-3 h-3" /> },
                { label: 'P0 Identified', value: '9/9', icon: <Target className="w-3 h-3" /> },
                { label: 'Logic Entropy', value: 'Minimal', icon: <Shield className="w-3 h-3" /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900/30 border border-white/5 p-3 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-slate-600">
                    {stat.icon}
                    <span className="text-[9px] font-bold tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px] select-none" onContextMenu={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {files.length === 0 && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-slate-900/10"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900/40 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                  <Terminal className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-sm text-slate-600 font-medium tracking-wide font-mono uppercase tracking-[0.2em]">等待臨床指令輸入...</p>
                <div className="mt-4 flex gap-2 text-[10px] text-slate-800 font-mono">
                  [ STANDBY MODE ]
                </div>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-slate-900/10 overflow-hidden"
              >
                <div className="relative w-24 h-24 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20"
                  />
                  <div className="absolute inset-4 rounded-full border border-emerald-500/40 animate-pulse flex items-center justify-center bg-emerald-500/5">
                    <Loader2 className="w-6 h-6 text-emerald-500/60 animate-spin" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono tracking-[0.3em] uppercase animate-pulse">Synthesizing Clinical DNA...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="output"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col border border-white/10 rounded-2xl bg-slate-950/50 backdrop-blur-md overflow-hidden shadow-3xl shadow-black"
              >
                {/* File Tabs */}
                <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/30 px-2">
                  <div className="flex overflow-x-auto scrollbar-hide py-1">
                    {files.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => setActiveFile(file.name)}
                        className={`group flex items-center gap-2.5 px-5 py-3.5 text-[11px] font-bold tracking-tight whitespace-nowrap transition-all relative ${
                          activeFile === file.name
                            ? 'text-emerald-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {getFileIcon(file.name)}
                        <span className="relative z-10 font-mono">{file.name}</span>
                        {activeFile === file.name && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/80 shadow-[0_-2px_8px_rgba(16,185,129,0.3)]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pr-4 py-1">
                    <button
                      onClick={handleDownloadZip}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-900/50 hover:bg-slate-800 hover:text-white rounded-lg border border-white/5 transition-all active:scale-95 shadow-lg group/btn"
                    >
                      <Download className="w-3.5 h-3.5 group-hover/btn:text-emerald-400 transition-colors" />
                      <span>Export DNA Repo</span>
                    </button>
                  </div>
                </div>
                
                {/* File Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/50">
                  <AnimatePresence mode="wait">
                    {files.map((file) => 
                      activeFile === file.name && (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <FileViewer file={file} />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>

                <div className="px-8 py-4 border-t border-white/5 bg-slate-900/20 flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>STRUCTURE: 628SP PROTOCOL</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span>ENCODING: UTF-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-500/40" />
                    COMMAND STABLE
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
