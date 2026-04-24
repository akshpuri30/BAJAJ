"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play, Trash2, Code2, Sparkles } from "lucide-react";
import Results from "./Results";
import type { ApiResponse } from "@/lib/types";

export default function Analyzer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadSample = () => {
    const sample = 'A->B\nA->C\nB->D\nC->E\nE->F\nX->Y\nY->Z\nZ->X\nP->Q\nQ->R\nG->H\nG->H\nG->I\nhello\n1->2\nA->';
    setInput(sample);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const parsedData = input.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
      
      const response = await fetch('/api/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputArr: parsedData })
      });
      
      if (!response.ok) {
        throw new Error("Failed to process data");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Line numbers generation
  const lineCount = Math.max(1, input.split('\n').length);
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <section id="analyzer" className="py-24 relative">
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight mb-3 flex items-center gap-3 text-red-500">
          Hierarchy Analyzer
        </h2>
        <p className="text-blue-400 text-sm max-w-2xl">
          Process large-scale node relationships in milliseconds. Input your directed edges below to map dependencies and identify cyclic structures.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
        
        {/* Input Editor Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 sticky top-24"
        >
          <div className="neo-container flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="h-12 bg-white/5 border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                <Code2 className="w-4 h-4" />
                <span>input.txt</span>
              </div>
              <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              </div>
            </div>

            {/* Editor Body */}
            <div className="relative flex bg-[#0a0a0a] min-h-[320px] shadow-inner">
              {/* Line Numbers */}
              <div className="w-12 flex-shrink-0 bg-white/[0.02] border-r border-blue-500/20 py-4 flex flex-col items-end pr-3 select-none">
                {lines.map(n => (
                  <span key={n} className="text-xs text-blue-500/50 font-mono leading-6">{n}</span>
                ))}
              </div>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full flex-grow bg-transparent p-4 text-red-500 font-mono text-sm leading-6 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-blue-500/[0.02] resize-none caret-blue-500 transition-all duration-300"
                spellCheck={false}
                placeholder={`A->B\nA->C\nB->D`}
              />
            </div>

            {/* Editor Footer / Actions */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                  className="neo-button-primary flex-1 py-2.5 text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {loading ? "Processing..." : "Process"}
                </button>
                
                <button
                  onClick={loadSample}
                  className="neo-button-secondary px-4 py-2.5 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  Load Sample
                </button>
                
                <button
                  onClick={() => { setInput(""); setResult(null); setError(null); }}
                  className="neo-button-secondary px-4 py-2.5 text-danger border-danger/20 hover:bg-danger/5"
                  title="Clear Input"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Results Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-full min-h-[500px]"
        >
          {result ? (
            <Results data={result} />
          ) : (
            <div className="h-full w-full rounded-2xl border border-blue-500/20 border-dashed flex flex-col items-center justify-center text-blue-500 glass min-h-[500px]">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-2 border-2 border-blue-500/50 rounded-full animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse" />
                </div>
              </div>
              <p className="font-mono text-sm uppercase tracking-widest text-red-500 font-bold">Awaiting Input</p>
              <p className="text-xs mt-2 text-blue-400 max-w-xs text-center">Results, structural visualizations, and graph metrics will appear here.</p>
            </div>
          )}
        </motion.div>
        
      </div>
    </section>
  );
}
