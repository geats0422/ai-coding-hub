import React, { useEffect, useState } from 'react';
import { Search, Command, FileText, Settings, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) onClose(); 
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    // We are handling the open toggle in the parent, but escape listener here is good
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search documentation..."
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 h-6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {query.length === 0 && (
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Suggested
            </div>
          )}
          
          <div className="px-2 space-y-1">
            <ResultItem icon={<Command className="w-4 h-4" />} title="Claude Code" subtitle="Installation" />
            <ResultItem icon={<FileText className="w-4 h-4" />} title="Claude Code" subtitle="Authentication" />
            <ResultItem icon={<Settings className="w-4 h-4" />} title="Gemini CLI" subtitle="Configuration" />
            <ResultItem icon={<FileText className="w-4 h-4" />} title="OpenCode" subtitle="Getting Started" />
          </div>
          
          {query.length > 0 && (
            <div className="px-6 py-12 text-center text-slate-500 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
           <span>Search by AI Coding Hub</span>
           <div className="flex gap-2">
             <span><kbd className="font-sans border rounded px-1">↑</kbd> <kbd className="font-sans border rounded px-1">↓</kbd> to navigate</span>
             <span><kbd className="font-sans border rounded px-1">↵</kbd> to select</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <button className="w-full flex items-center px-3 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-left group transition-colors">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-primary group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-600">
      {icon}
    </div>
    <div className="ml-3 flex-1">
      <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-200">
        {title}
        <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
        <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>
      </div>
    </div>
  </button>
);
