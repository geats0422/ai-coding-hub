import React, { useEffect, useMemo, useRef } from 'react';
import { cn } from '../lib/utils';

interface AdPlaceholderProps {
  className?: string;
  variant?: 'rect' | 'banner' | 'sidebar';
  label?: string;
}

type AdRenderMode = 'development' | 'none' | 'vercel';

type ImportMetaWithEnv = {
  env?: Record<string, string | undefined>;
};

type AdsByGoogleWindow = Window & {
  adsbygoogle?: unknown[];
};

const readEnv = (key: string): string => {
  const env = (import.meta as unknown as ImportMetaWithEnv).env;
  const value = env?.[key];
  return typeof value === 'string' ? value.trim() : '';
};

const getAdRenderMode = (): AdRenderMode => {
  const mode = readEnv('VITE_AD_PLACEHOLDER_MODE').toLowerCase();
  if (mode === 'none' || mode === 'development' || mode === 'vercel') {
    return mode;
  }

  if (mode === 'mock') {
    return 'development';
  }

  if (mode === 'adsense') {
    return 'vercel';
  }

  return 'development';
};

const getAdSlotByVariant = (variant: 'rect' | 'banner' | 'sidebar'): string => {
  if (variant === 'banner') {
    return readEnv('VITE_ADSENSE_SLOT_BANNER');
  }

  if (variant === 'sidebar') {
    return readEnv('VITE_ADSENSE_SLOT_SIDEBAR');
  }

  return readEnv('VITE_ADSENSE_SLOT_RECT');
};

const normalizeAdSenseClientId = (clientId: string): string => {
  if (!clientId) {
    return '';
  }
  return clientId.startsWith('ca-pub-') ? clientId : `ca-pub-${clientId}`;
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  className, 
  variant = 'rect',
  label = 'Advertisement Area'
}) => {
  const resolvedVariant: 'rect' | 'banner' | 'sidebar' =
    variant === 'banner' || variant === 'sidebar' ? variant : 'rect';
  const mode = getAdRenderMode();
  const adsenseClientId = useMemo(() => normalizeAdSenseClientId(readEnv('VITE_ADSENSE_CLIENT_ID')), []);
  const adsenseSlotId = useMemo(() => getAdSlotByVariant(resolvedVariant), [resolvedVariant]);
  const hasPushedAdRef = useRef(false);

  useEffect(() => {
    if (mode !== 'vercel' || !adsenseClientId || !adsenseSlotId || hasPushedAdRef.current) {
      return;
    }

    try {
      const adsWindow = window as AdsByGoogleWindow;
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
      hasPushedAdRef.current = true;
    } catch {
      hasPushedAdRef.current = false;
    }
  }, [adsenseClientId, adsenseSlotId, mode]);

  if (mode === 'none') {
    return null;
  }

  if (mode === 'vercel') {
    if (!adsenseClientId || !adsenseSlotId) {
      return null;
    }

    return (
      <ins
        className={cn('adsbygoogle block', className)}
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={adsenseSlotId}
        data-ad-format={resolvedVariant === 'banner' ? 'horizontal' : 'auto'}
        data-full-width-responsive={resolvedVariant === 'banner' ? 'true' : 'false'}
      />
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 group transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
        resolvedVariant === 'banner' && "w-full h-32 md:h-40 rounded-xl",
        resolvedVariant === 'sidebar' && "w-full h-64 rounded-lg",
        resolvedVariant === 'rect' && "w-full h-48 rounded-lg",
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
