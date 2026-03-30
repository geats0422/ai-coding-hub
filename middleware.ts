/**
 * Vercel Edge Middleware
 *
 * Solves: SPA canonical tag injection for Google indexing.
 * Google's crawler sees raw HTML before JavaScript executes.
 * Without server-side canonical injection, all pages appear as duplicates.
 *
 * This middleware:
 * 1. Handles category-level redirects (runs before vercel.json)
 * 2. Injects <link rel="canonical"> into the HTML response based on request URL
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

export async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // Category-level redirects (middleware runs before vercel.json redirects)
  const redirectTarget = CATEGORY_REDIRECTS[pathname];
  if (redirectTarget) {
    return Response.redirect(`${CANONICAL_BASE}${redirectTarget}`, 301);
  }

  // Fetch the raw SPA shell.
  // Sub-requests from middleware bypass middleware per Vercel docs, so no loop.
  // The vercel.json rewrite serves dist/index.html for "/".
  const response = await fetch(new URL('/', url.origin).toString());

  if (!response.ok) {
    return new Response('Internal Server Error', { status: 500 });
  }

  const html = await response.text();

  const canonicalUrl = `${CANONICAL_BASE}${pathname === '/' ? '' : pathname}`;
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  const modifiedHtml = html.replace('</head>', `${canonicalTag}\n  </head>`);

  return new Response(modifiedHtml, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

// Only match SPA routes (paths without file extensions).
// Static assets (.js, .css, .svg, .png, etc.) are served directly.
export const config = {
  matcher: ['/((?!.*\\..*).*)'],
};
