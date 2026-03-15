import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const siteUrl = 'https://www.aicodinghub.dev';
const publicPath = path.join(root, 'public', 'sitemap.xml');

const docsBoards = [
  { dir: 'claude-code', route: 'claude' },
  { dir: 'gemini-cli', route: 'gemini' },
  { dir: 'opencode', route: 'opencode' },
  { dir: 'codex', route: 'codex' },
  { dir: 'playbook', route: 'playbook' },
];

const localePriority = ['en', 'zh'];

const toSafeSlug = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/_final\.mdx$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'doc';

const getSlugFromFrontmatter = (fileContent) => {
  const normalizedContent = fileContent.replace(/^\uFEFF/, '');
  const frontmatterMatch = normalizedContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return '';
  }

  const slugMatch = frontmatterMatch[1].match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
  return slugMatch ? slugMatch[1].trim() : '';
};

const urls = new Set(['/','/privacy','/terms']);

for (const board of docsBoards) {
  let selectedFiles = [];

  for (const locale of localePriority) {
    const contentDir = path.join(root, 'content', board.dir, locale);

    if (!existsSync(contentDir)) {
      continue;
    }

    const files = readdirSync(contentDir).filter((file) => file.endsWith('.mdx'));

    if (files.length > 0) {
      selectedFiles = files.map((file) => path.join(contentDir, file));
      break;
    }
  }

  const seenSlugs = new Set();
  for (const filePath of selectedFiles) {
    const file = path.basename(filePath);
    const content = readFileSync(filePath, 'utf-8');
    const frontmatterSlug = getSlugFromFrontmatter(content);
    const slug = frontmatterSlug || toSafeSlug(file);

    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate slug '${slug}' detected while generating sitemap for ${board.route}.`);
    }

    seenSlugs.add(slug);
    urls.add(`/docs/${board.route}/${slug}`);
  }
}

const now = new Date().toISOString();
const sortedUrls = [...urls].sort((a, b) => a.localeCompare(b));

const body = sortedUrls
  .map((relativeUrl) => {
    const loc = `${siteUrl}${relativeUrl}`;
    const isRoot = relativeUrl === '/';
    const isDocArticle = relativeUrl.startsWith('/docs/') && relativeUrl.split('/').length >= 4;
    const changefreq = isRoot ? 'daily' : isDocArticle ? 'weekly' : 'monthly';
    const priority = isRoot ? '1.0' : isDocArticle ? '0.9' : '0.6';

    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(publicPath, xml, 'utf-8');
