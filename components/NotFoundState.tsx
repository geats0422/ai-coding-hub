import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { updateSeo } from '../lib/seo';

interface NotFoundStateProps {
  title?: string;
  heading: string;
  message: string;
  backHref?: string;
  backLabel?: string;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title,
  heading,
  message,
  backHref = '/',
  backLabel = 'Back to home',
}) => {
  useEffect(() => {
    updateSeo({
      title: title ?? `${heading} | AI Coding Hub`,
      robots: 'noindex,follow',
    });
  }, [heading, title]);

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/60 px-8 py-12 text-center shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">404</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground">{message}</p>
        <Link
          to={backHref}
          className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
};
