import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import Callout from '../components/Callout';
import { MdxCodeBlock } from '../components/MdxCodeBlock';
import { useLanguage } from '../context/LanguageContext';

type Frontmatter = {
  title?: string;
  description?: string;
  slug?: string;
};

type MdxModule = {
  default: React.ComponentType<{
    components?: Record<string, React.ComponentType<Record<string, unknown>>>;
  }>;
  frontmatter?: Frontmatter;
};

type GeminiDocItem = {
  fileName: string;
  title: string;
  description: string;
  slug: string;
  categoryOrder: number;
  category: string;
  subOrder: string;
  subCategory: string;
  Content: MdxModule['default'];
};

type SidebarSubGroup = {
  subOrder: string;
  subCategory: string;
  docs: GeminiDocItem[];
};

type SidebarCategoryGroup = {
  categoryOrder: number;
  category: string;
  subGroups: SidebarSubGroup[];
};

const mdxModulesEn = import.meta.glob('../content/gemini-cli/en/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

const mdxModulesZh = import.meta.glob('../content/gemini-cli/zh/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

const toSafeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/_final\.mdx$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'doc';

const getFileName = (path: string) => path.split('/').pop() ?? path;

const parseDocFileMeta = (fileName: string) => {
  const match = fileName.match(/^\s*(\d+)\.\s*(.+?)\s*-\s*(\d+\.\d+)\s*(.+?)\s*-\s*(.+?)_final\.mdx$/i);
  if (!match) {
    return null;
  }
  return {
    categoryOrder: Number(match[1]),
    category: match[2].trim(),
    subOrder: match[3].trim(),
    subCategory: match[4].trim(),
    title: match[5].trim(),
  };
};

const FileTree: React.FC<{ tree?: unknown }> = ({ tree }) => (
  <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/20 p-3 text-xs">{JSON.stringify(tree, null, 2)}</pre>
);

const ToggleSection: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <details className="my-3 rounded-lg border border-border p-3">
    <summary className="cursor-pointer font-medium">{title || 'Details'}</summary>
    <div className="mt-2">{children}</div>
  </details>
);

const WorkflowSteps: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div className="my-3 space-y-2">{children}</div>;

const mdxComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  AdPlaceholder,
  h1: () => null,
  Callout,
  FileTree,
  ToggleSection,
  WorkflowSteps,
  pre: MdxCodeBlock as React.ComponentType<Record<string, unknown>>,
};

export const GeminiDocs: React.FC = () => {
  const { language } = useLanguage();
  const uncategorizedLabel = language === 'zh' ? '未分类' : 'Uncategorized';
  const docsLabel = language === 'zh' ? 'Gemini CLI 文档' : 'Gemini CLI Docs';
  const emptyStateLabel =
    language === 'zh'
      ? '未找到可加载的文档文件，请检查 `content/gemini-cli/zh` 或 `content/gemini-cli/en`。'
      : 'No loadable docs found. Please check `content/gemini-cli/zh` or `content/gemini-cli/en`.';

  const selectedModules = useMemo(() => {
    const preferred = language === 'zh' ? mdxModulesZh : mdxModulesEn;
    if (Object.keys(preferred).length > 0) {
      return preferred;
    }
    return language === 'zh' ? mdxModulesEn : mdxModulesZh;
  }, [language]);

  const docs = useMemo<GeminiDocItem[]>(() => {
    return (Object.entries(selectedModules) as Array<[string, MdxModule]>)
      .map(([path, mod]) => {
        const fileName = getFileName(path);
        const frontmatter = mod.frontmatter ?? {};
        const parsedMeta = parseDocFileMeta(fileName);
        return {
          fileName,
          title: parsedMeta?.title || frontmatter.title?.trim() || fileName,
          description: frontmatter.description?.trim() || '',
          slug: frontmatter.slug?.trim() || toSafeSlug(fileName),
          categoryOrder: parsedMeta?.categoryOrder ?? Number.MAX_SAFE_INTEGER,
          category: parsedMeta?.category ?? uncategorizedLabel,
          subOrder: parsedMeta?.subOrder ?? '0',
          subCategory: parsedMeta?.subCategory ?? uncategorizedLabel,
          Content: mod.default,
        };
      })
      .sort((a, b) => {
        if (a.categoryOrder !== b.categoryOrder) {
          return a.categoryOrder - b.categoryOrder;
        }
        const subOrderCompare = a.subOrder.localeCompare(b.subOrder, 'zh-Hans-CN', {
          numeric: true,
          sensitivity: 'base',
        });
        if (subOrderCompare !== 0) {
          return subOrderCompare;
        }
        return a.fileName.localeCompare(b.fileName, 'zh-Hans-CN', {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }, [selectedModules, uncategorizedLabel]);

  const sidebarGroups = useMemo<SidebarCategoryGroup[]>(() => {
    const categoryMap = new Map<string, { categoryOrder: number; category: string; subMap: Map<string, SidebarSubGroup> }>();

    docs.forEach((doc) => {
      const categoryKey = `${doc.categoryOrder}-${doc.category}`;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          categoryOrder: doc.categoryOrder,
          category: doc.category,
          subMap: new Map<string, SidebarSubGroup>(),
        });
      }
      const category = categoryMap.get(categoryKey);
      if (!category) {
        return;
      }
      const subKey = `${doc.subOrder}-${doc.subCategory}`;
      if (!category.subMap.has(subKey)) {
        category.subMap.set(subKey, {
          subOrder: doc.subOrder,
          subCategory: doc.subCategory,
          docs: [],
        });
      }
      category.subMap.get(subKey)?.docs.push(doc);
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => a.categoryOrder - b.categoryOrder)
      .map((category) => ({
        categoryOrder: category.categoryOrder,
        category: category.category,
        subGroups: Array.from(category.subMap.values()).sort((a, b) =>
          a.subOrder.localeCompare(b.subOrder, 'zh-Hans-CN', {
            numeric: true,
            sensitivity: 'base',
          })
        ),
      }));
  }, [docs]);

  const { slug } = useParams<{ slug?: string }>();
  const hasSlugMatch = Boolean(slug && docs.some((item) => item.slug === slug));
  const activeDoc = docs.find((item) => item.slug === slug) ?? docs[0];

  useEffect(() => {
    if (!activeDoc) {
      return;
    }

    document.title = `${activeDoc.title} | AI Coding Hub`;
    const canonicalUrl = `https://www.aicodinghub.dev/docs/gemini/${activeDoc.slug}`;
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
        <h1 className="text-2xl font-bold mb-2">Gemini CLI</h1>
        <p className="text-muted-foreground">{emptyStateLabel}</p>
      </main>
    );
  }

  if (!hasSlugMatch) {
    return <Navigate to={`/docs/gemini/${docs[0].slug}`} replace />;
  }

  const ActiveContent = activeDoc.Content;

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto flex items-start">
      <aside className="hidden lg:block w-80 sticky top-16 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{docsLabel}</h3>
          <ul className="space-y-4">
            {sidebarGroups.map((categoryGroup) => (
              <li key={`${categoryGroup.categoryOrder}-${categoryGroup.category}`}>
                <p className="px-3 text-sm font-semibold text-foreground">{`${categoryGroup.categoryOrder} ${categoryGroup.category}`}</p>
                <ul className="mt-2 space-y-3">
                  {categoryGroup.subGroups.map((subGroup) => (
                    <li key={`${categoryGroup.categoryOrder}-${subGroup.subOrder}-${subGroup.subCategory}`}>
                      <p className="px-3 text-xs font-medium text-muted-foreground">{`${subGroup.subOrder} ${subGroup.subCategory}`}</p>
                      <ul className="mt-1 space-y-1">
                        {subGroup.docs.map((doc) => {
                          const isActive = doc.slug === activeDoc.slug;
                          return (
                            <li key={doc.fileName}>
                              <Link
                                to={`/docs/gemini/${doc.slug}`}
                                className={`block w-full text-left px-5 py-2 rounded-md text-sm transition-colors ${
                                  isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                              >
                                {doc.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-10">
        <nav className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium">Gemini CLI</span>
        </nav>

        <p className="text-sm text-muted-foreground mb-1">{`${activeDoc.categoryOrder} ${activeDoc.category}`}</p>
        <p className="text-base text-foreground/80 mb-3">{`${activeDoc.subOrder} ${activeDoc.subCategory}`}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">{activeDoc.title}</h1>
        {activeDoc.description ? <p className="text-muted-foreground mb-8 max-w-3xl">{activeDoc.description}</p> : null}

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ActiveContent components={mdxComponents} />
        </article>
      </main>
    </div>
  );
};
