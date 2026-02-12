declare module '*.md' {
  import type { ComponentType, ReactNode } from 'react';

  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  }>;

  export const frontmatter: Record<string, unknown>;
  export default MDXContent;
}

declare module '*.mdx' {
  import type { ComponentType, ReactNode } from 'react';

  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  }>;

  export const frontmatter: Record<string, unknown>;
  export default MDXContent;
}
