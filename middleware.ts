/**
 * Vercel Edge Middleware
 *
 * Solves: SPA canonical tag injection for Google indexing.
 * Google's crawler sees raw HTML before JavaScript executes.
 * Without server-side canonical injection, all pages appear as duplicates.
 *
 * This middleware:
 * 1. Passes through static assets unchanged
 * 2. Handles category-level redirects (runs before vercel.json)
 * 3. Injects <link rel="canonical"> into the HTML response based on request URL
 */

const CANONICAL_BASE = 'https://www.aicodinghub.dev';

// Must stay in sync with vercel.json redirects
const CATEGORY_REDIRECTS: Record<string, string> = {
  '/docs': '/docs/claude/claude-code-overview',
  '/docs/claude': '/docs/claude/claude-code-overview',
  '/docs/gemini': '/docs/gemini/quickstart-installation',
  '/docs/opencode': '/docs/opencode/opencode-intro',
  '/docs/codex': '/docs/codex/authentication',
  '/docs/playbook': '/docs/playbook/claude-code-token-context-surgery',
};

function isStaticAsset(pathname: string): boolean {
  const lastSegment = pathname.split('/').pop() ?? '';
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex === -1) return false;
  const ext = lastSegment.slice(dotIndex).toLowerCase();
  return [
    '.js', '.mjs', '.cjs', '.css', '.scss', '.less',
    '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.json', '.xml', '.txt', '.map', '.webmanifest',
  ].includes(ext);
}

export async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // Static assets — pass through untouched
  if (isStaticAsset(pathname)) {
    return fetch(request);
  }

  // Category-level redirects (middleware runs before vercel.json redirects)
  const redirectTarget = CATEGORY_REDIRECTS[pathname];
  if (redirectTarget) {
    return Response.redirect(`${CANONICAL_BASE}${redirectTarget}`, 301);
  }

  // Sub-requests from middleware bypass middleware per Vercel docs, so no loop.
  const response = await fetch(new URL('/', url.origin).toString());

  if (!response.ok) {
    return new Response('Internal Server Error', { status: 500 });
  }

  const html = await response.text();

  const canonicalUrl = `${CANONICAL_BASE}${pathname === '/' ? '' : pathname}`;
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  const CANONICAL_RE = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/;
  const modifiedHtml = html.includes('rel="canonical"')
    ? html.replace(CANONICAL_RE, canonicalTag)
    : html.replace('</head>', `${canonicalTag}\n  </head>`);

  return new Response(modifiedHtml, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

export const config = {
  matcher: ['/:path*'],
};
