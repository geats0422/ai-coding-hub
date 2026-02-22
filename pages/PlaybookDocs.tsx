import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { MdxCodeBlock } from '../components/MdxCodeBlock';
import { useLanguage } from '../context/LanguageContext';

type Frontmatter = {
  title?: string;
  description?: string;
  slug?: string;
};

type MdxModule = {
  default: React.ComponentType<{
    components?: Record<string, React.ComponentType<{ children?: React.ReactNode }>>;
  }>;
  frontmatter?: Frontmatter;
};

type PlaybookDocItem = {
  fileName: string;
  title: string;
  description: string;
  slug: string;
  Content: MdxModule['default'];
};

const mdxModulesEn = import.meta.glob('../content/playbook/en/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

const mdxModulesZh = import.meta.glob('../content/playbook/zh/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

const toSafeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/_final\.mdx$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'doc';

const getFileName = (path: string) => path.split('/').pop() ?? path;

const mdxComponents: Record<string, React.ComponentType<{ children?: React.ReactNode }>> = {
  AdPlaceholder,
  h1: () => null,
  pre: MdxCodeBlock,
};

export const PlaybookDocs: React.FC = () => {
  const { language } = useLanguage();
  const pageTitle = language === 'zh' ? 'AI 实战手册' : 'AI Playbook';
  const docsLabel = language === 'zh' ? 'AI Coding 技巧' : 'AI Coding Tips';
  const emptyStateLabel =
    language === 'zh'
      ? '该板块暂时为空。你可以在 `content/playbook/zh` 或 `content/playbook/en` 中新增 `.mdx` 文件。'
      : 'This section is currently empty. Add `.mdx` files in `content/playbook/zh` or `content/playbook/en`.';

  const selectedModules = useMemo<Record<string, MdxModule>>(() => {
    const preferred = language === 'zh' ? mdxModulesZh : mdxModulesEn;
    if (Object.keys(preferred).length > 0) {
      return preferred;
    }
    return language === 'zh' ? mdxModulesEn : mdxModulesZh;
  }, [language]);

  const docs = useMemo<PlaybookDocItem[]>(() => {
    return (Object.entries(selectedModules) as Array<[string, MdxModule]>)
      .map(([path, mod]) => {
        const fileName = getFileName(path);
        const frontmatter = mod.frontmatter ?? {};
        return {
          fileName,
          title: frontmatter.title?.trim() || fileName,
          description: frontmatter.description?.trim() || '',
          slug: frontmatter.slug?.trim() || toSafeSlug(fileName),
          Content: mod.default,
        };
      })
      .sort((a, b) =>
        a.fileName.localeCompare(b.fileName, 'zh-Hans-CN', {
          numeric: true,
          sensitivity: 'base',
        })
      );
  }, [selectedModules]);

  const { slug } = useParams<{ slug?: string }>();
  const hasSlugMatch = Boolean(slug && docs.some((item) => item.slug === slug));
  const activeDoc = docs.find((item) => item.slug === slug) ?? docs[0];

  useEffect(() => {
    if (!activeDoc) {
      return;
    }

    document.title = `${activeDoc.title} | AI Coding Hub`;
    const canonicalUrl = `https://www.aicodinghub.dev/docs/playbook/${activeDoc.slug}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', canonicalUrl);
  }, [activeDoc]);

  if (docs.length === 0) {
    return (
      <main className="flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground">{emptyStateLabel}</p>
      </main>
    );
  }

  if (!hasSlugMatch) {
    return <Navigate to={`/docs/playbook/${docs[0].slug}`} replace />;
  }

  const ActiveContent = activeDoc.Content;

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto flex items-start">
      <aside className="hidden lg:block w-80 sticky top-16 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{docsLabel}</h3>
          <ul className="space-y-1">
            {docs.map((doc) => {
              const isActive = doc.slug === activeDoc.slug;
              return (
                <li key={doc.fileName}>
                  <Link
                    to={`/docs/playbook/${doc.slug}`}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-10">
        <nav className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium">{pageTitle}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">{activeDoc.title}</h1>
        {activeDoc.description ? <p className="text-muted-foreground mb-8 max-w-3xl">{activeDoc.description}</p> : null}

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ActiveContent components={mdxComponents} />
        </article>
      </main>
    </div>
  );
};
