"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, AlertTriangle, Layers } from "lucide-react";
import type { HierarchyGroup } from "@/lib/types";

// Helper component for recursive rendering
const TreeNode = ({ node, childrenObj, level = 0, hasCycle = false }: { node: string, childrenObj: Record<string, any>, level?: number, hasCycle?: boolean }) => {
  const [isOpen, setIsOpen] = useState(true);
  const childrenKeys = Object.keys(childrenObj);
  const hasChildren = childrenKeys.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </button>
        ) : (
          <div className="w-5 h-5" /> // spacer
        )}
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-bold transition-all ${
          level === 0 
            ? 'bg-accent/20 text-accent border-accent/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
            : hasCycle && !hasChildren
              ? 'bg-warning/20 border-warning/40 text-warning shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-white/5 border-white/10 text-gray-200 hover:border-white/20'
        }`}>
          {node}
          {hasCycle && !hasChildren && (
            <AlertTriangle className="w-3 h-3 text-warning ml-1" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-2.5 pl-6 border-l border-white/10 flex flex-col gap-1 my-1"
          >
            {childrenKeys.map(child => (
              <TreeNode 
                key={child} 
                node={child} 
                childrenObj={childrenObj[child]} 
                level={level + 1}
                hasCycle={hasCycle}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TreeVisualizer({ group }: { group: HierarchyGroup }) {
  return (
    <div className="bg-[#111111] rounded-xl border border-white/10 p-4 relative overflow-hidden group shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 shadow-inner flex items-center justify-center border border-white/10">
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-300">Root: <span className="text-accent font-mono ml-1">{group.root}</span></span>
            {group.depth !== undefined && (
              <span className="ml-3 text-xs text-gray-500 font-bold uppercase">Depth: {group.depth}</span>
            )}
          </div>
        </div>
        
        {group.has_cycle && (
          <div className="px-2.5 py-1 rounded-md bg-warning/10 border border-warning/20 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-warning">Cycle Detected</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max p-2">
          <TreeNode node={group.root} childrenObj={group.tree[group.root] || {}} hasCycle={group.has_cycle} />
        </div>
      </div>
    </div>
  );
}
