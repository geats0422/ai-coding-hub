import React, { useMemo, useState } from 'react';
import { cn } from '../lib/utils';

interface MdxCodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

const getCodeText = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => getCodeText(child)).join('');
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return getCodeText(children.props.children ?? '');
  }

  return '';
};

export const MdxCodeBlock: React.FC<MdxCodeBlockProps> = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeText = useMemo(() => getCodeText(children).trimEnd(), [children]);

  const handleCopy = async () => {
    if (!codeText) {
      return;
    }

    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-4">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md border border-border bg-background/90 px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className={cn(className)} {...props}>
        {children}
      </pre>
    </div>
  );
};
