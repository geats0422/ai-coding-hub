import React from 'react';
import { cn } from '../lib/utils';

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning';
  children?: React.ReactNode;
}

const styleByType: Record<NonNullable<CalloutProps['type']>, string> = {
  note: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200',
  tip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
};

export const Callout: React.FC<CalloutProps> = ({ type = 'note', children }) => {
  return <div className={cn('my-4 rounded-lg border px-4 py-3', styleByType[type])}>{children}</div>;
};

export default Callout;
