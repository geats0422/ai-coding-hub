import React from 'react';
import { cn } from '../lib/utils';

interface AdPlaceholderProps {
  className?: string;
  variant?: 'rect' | 'banner' | 'sidebar';
  label?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  className, 
  variant = 'rect',
  label = 'Advertisement Area'
}) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 group transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
        variant === 'banner' && "w-full h-32 md:h-40 rounded-xl",
        variant === 'sidebar' && "w-full h-64 rounded-lg",
        variant === 'rect' && "w-full h-48 rounded-lg",
        className
      )}
    >
      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 rounded border border-slate-300 dark:border-slate-700">
        Ad
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="text-center z-10">
         <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            {label}
         </p>
         <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Enterprise Grade AI Infrastructure
         </p>
         <button className="mt-3 text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            Learn More
         </button>
      </div>
    </div>
  );
};

export default AdPlaceholder;
