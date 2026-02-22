# AI Coding Hub - Agent Configuration

This file contains essential information for agentic coding systems working in this repository.

## Build & Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000, host 0.0.0.0)
npm run build        # Build for production
npm run preview      # Preview production build
```

**No testing framework** is currently configured. Tests should be added using Vitest or Jest before implementing test-driven development.

## Project Stack

- **Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0 with @vitejs/plugin-react
- **Styling**: Tailwind CSS (configured via Vite)
- **Icons**: lucide-react
- **Routing**: react-router-dom (HashRouter)
- **Utilities**: clsx + tailwind-merge (via `cn()` helper)
- **i18n**: Custom LanguageContext (en/zh)

## TypeScript Configuration

- Target: ES2022
- Module: ESNext
- JSX: react-jsx (automatic runtime)
- Path alias: `@/*` → `./` (use for absolute imports)

## Code Style Guidelines

### Component Structure
- **Only functional components** using `React.FC<Type>` pattern
- No class components
- Use React hooks for all state and side effects:
  - `useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`
- Props interface defined before component export

### Naming Conventions
- **Components**: PascalCase (e.g., `Layout`, `CommandPalette`)
- **Functions/Variables**: camelCase (e.g., `setLanguage`, `scrollToId`)
- **Interfaces/Types**: PascalCase (e.g., `LanguageContextType`, `DocSection`)
- **Constants**: lowercase or UPPER_CASE for module-level exports
- **Files**: PascalCase for components, lowercase for utilities/data

### Import Patterns
- Prefer relative imports for local modules: `./components/Layout`, `../lib/utils`
- Use `@/*` alias for deeper nesting when beneficial
- Group imports in this order:
  1. React & third-party
  2. Internal components
  3. Utilities/context
  4. Types/interfaces

### Styling
- **Tailwind CSS only** - no inline styles or CSS modules
- Use `cn()` utility from `lib/utils` for conditional class merging
- Responsive design: mobile-first (`sm:`, `md:`, `lg:` prefixes)
- Dark mode: use `dark:` prefix; controlled via `document.documentElement` class

### State Management
- **React Context** for global state (see `LanguageContext.tsx`)
- Local component state via `useState` for UI state
- No external state libraries (Redux, Zustand, etc.)

### Error Handling
- Use TypeScript interfaces for type safety
- **NEVER** use `@ts-ignore` - one instance exists in `LanguageContext.tsx` but should be removed
- Throw descriptive errors with context when context hooks are misused

### Internationalization
- All UI text must use the `t()` function from `useLanguage()` hook
- Translation keys in `data/locales.ts` use dot notation: `"nav.home"`, `"hero.title"`
- English (`en`) and Chinese (`zh`) supported

### File Organization
```
/
├── components/     # Reusable UI components
├── context/        # React Context providers
├── pages/          # Route-level page components
├── data/           # Static data (locales, docs content)
├── lib/            # Utility functions
├── types.ts        # Shared TypeScript interfaces
├── App.tsx         # Root component + routing
└── index.tsx       # Entry point
```

## Environment Variables
- `GEMINI_API_KEY`: Required (set in `.env.local`)
- Exposed via `process.env.GEMINI_API_KEY` in client code

## Development Notes

1. **No linting/formatting tools** configured (no ESLint, Prettier, Stylelint)
2. **Hot reload** enabled via Vite
3. **BrowserRouter** used for SEO-friendly URLs (requires vercel.json SPA rewrite for static deployment)
4. **Command palette** accessible via `Cmd+K` / `Ctrl+K`

---

## 开发历程总结

### 1. 项目概述

本项目是一个AI工具教程网站，整合了Claude Code、OpenCode、Gemini CLI和Codex四个AI编程工具的官方文档。项目采用React 19 + TypeScript + Vite技术栈，通过MDX实现了文档的动态加载与渲染，并支持中英文双语切换功能。

### 2. Gemini CLI与Codex迁移全流程

#### 2.1 迁移策略
1. **源文档扫描**: 遍历`Reference Document/Gemini Cli`和`Reference Document/Codex`
2. **Frontmatter注入**: 添加`tool`、`locale`、`slug`等必需字段
3. **中英文同步**: 生成对应中文版本，保持slug一致
4. **组件注入**: 添加`AdPlaceholder`、`Callout`等MDX组件

#### 2.2 迁移脚本实现
**文件**: `scripts/migrate_docs_bilingual.py`

核心功能：
- `parse_doc_filename()` - 解析文件名提取元数据
- `translate_content()` - 调用LLM进行内容翻译
- `generate_zh_filename()` - 生成中文文件名
- `process_one_file()` - 单文件处理流程
- `batch_migrate()` - 批量迁移入口

#### 2.3 迁移脚本优化
- 调整翻译分块大小（3000→800字符/块）
- 优化文件名翻译逻辑（保留已有中文文件名）
- 添加翻译缓存机制（`translation_cache.json`）

### 3. MDX语法修复

#### 3.1 问题识别
迁移过程中发现大量MDX语法问题，导致编译失败：
- 代码块与正文粘连
- JSX标签与文本粘连
- HTML注释未转换为JSX注释
- 未闭合的MDX标签

#### 3.2 批量修复脚本
**文件**: `scripts/fix_mdx_format.py`

修复规则：
- 行尾标准化（\r\n → \n）
- HTML注释转JSX注释（<!-- --> → {/* */})
- JSX标签前强制换行
- 代码块前后强制换行
- 移除非法锚点链接（href="@@P5@@"）
- 转义特殊标签为行内代码

#### 3.3 定点修复案例
- `自定义命令_final.mdx`: 修复TOML代码块嵌套问题
- `功能概览_final.mdx`: 移除非法Callout嵌套
- `技能结合_final.mdx`: 移除FileTree组件（因未定义）
- `工作流范例_final.mdx`: 移除WorkflowSteps标签

### 4. 犯过的错误及教训

#### 4.1 技术选型类错误
**错误1**: MDX编译模式选择
- **问题**: 最初使用`import.meta.glob(...?raw)`导致组件无法渲染
- **原因**: raw模式返回纯文本，MDX组件不被解析
- **教训**: 渲染型MDX应使用默认导入（不带`?raw`）

**错误2**: 兜底组件缺失
- **问题**: Codex文档使用`<FileTree>`、`<ToggleSection>`等未定义组件
- **原因**: 源码中未实现这些组件
- **教训**: 迁移前应扫描所有MDX文件，列出所有使用的组件

#### 4.2 实现逻辑类错误
**错误3**: 文件名解析正则不匹配
- **问题**: Codex文件名模式与正则不匹配（缺少`\s`）
- **原因**: Codex使用`1 入门-1.1 安装-快速开始_final.mdx`格式
- **教训**: 实现前应完整分析所有文件名格式，统一正则

**错误4**: 翻译分块过大
- **问题**: 翻译分块3000字符导致LLM响应截断
- **表现**: 某些文件翻译不完整
- **教训**: 应根据文档结构调整分块大小（最终改为800字符）

#### 4.3 调试排查类错误
**错误5**: MDX编译失败定位困难
- **问题**: 编译错误只提示行号，不显示具体位置
- **解决**: 使用`@mdx-js/mdx`的compile()函数进行单文件调试
- **教训**: 应建立增量验证机制，每迁移一批立即验证

**错误6**: import.meta.glob类型推断失败
- **问题**: 返回类型推断为`unknown`，无法访问`.default`和`.frontmatter`
- **解决**: 添加类型断言`as Record<string, MdxModule>`
- **教训**: 处理Vite动态导入时应明确声明类型

### 5. 最终成果

#### 5.1 文档成果
- **Gemini CLI**: 25个文档文件（en + zh）
- **Codex**: 28个文档文件（en + zh）
- **总计**: 106个MDX文件全部编译通过

#### 5.2 代码成果
- **新增页面**: GeminiDocs.tsx、CodexDocs.tsx
- **新增脚本**: migrate_docs_bilingual.py、fix_mdx_format.py
- **修复组件**: FileTree、ToggleSection、WorkflowSteps兜底实现

#### 5.3 功能成果
- 四大AI工具文档完整集成
- 中英文双语切换
- 三级导航结构
- 社交链接（GitHub + Bilibili）

### 6. Playbook 教程编写复盘（可复利 SOP）

#### 6.1 背景与目标
- **输入源**: `Reference Document/playbook/*.md`
- **目标落点**: `content/playbook/zh/*.mdx` 与 `content/playbook/en/*.mdx`
- **质量目标**: 前台可渲染、结构统一、支持中英切换、资源目录可持续扩展

#### 6.2 本次任务产出（样例）
- 中文文档: `content/playbook/zh/1. 工作流与效率-1.1 上下文卫生-Claude Code Token 外科手术指南_final.mdx`
- 英文文档: `content/playbook/en/1. Workflow and Productivity-1.1 Context Hygiene-Claude Code Token Surgery Playbook_final.mdx`
- 中文配图: `content/playbook/assets/你以为在写代码其实在给僵尸上下文交税：Claude Code Token 外科手术指南/context-surgery.svg`
- 英文配图: `content/playbook/assets/claude-code-token-context-surgery/context-surgery-en.svg`

#### 6.3 可复用流程（每篇照做）
1. **源文盘点**: 从 `Reference Document/<board>/` 读取原稿，确认语言、主题、命令块与证据链接是否完整。
2. **命名落位**: 按 `{CategoryOrder}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx` 命名并放入对应语言目录。
3. **Frontmatter 标准化**: 必填 `title/description/slug/date/tool`，中英文同主题保持相同 `slug`。
4. **MDX 转换**: 原始 Markdown 升级为 MDX，保留代码块；广告位按页面既有能力使用 `<AdPlaceholder />`。
5. **配图规范化**: 每篇教程单独目录放在 `content/<board>/assets/<教程标题或稳定ID>/`。
6. **图片引用方式**: 在 MDX 中使用 `import image from '../assets/.../xxx.svg'` + `<img src={image} />`。
7. **双语同步**: 同步产出 `zh/en` 两版，结构一致、术语对应、链接一致、`slug` 一致。
8. **构建验收**: 执行 `npm run build`，以构建通过作为文档发布门槛。

#### 6.4 易错点与规避策略
- **易错 1**: `![alt]({imageVar})` 在 MDX 中不稳定。
  - **规避**: 统一使用 `<img src={imageVar} alt="..." />`。
- **易错 2**: 只做中文不做英文，导致语言切换体验割裂。
  - **规避**: 把“同 slug 的 en/zh 配对”设为完成定义（Definition of Done）。
- **易错 3**: 资源放错到全局 `content/assets/`。
  - **规避**: 强制放入 `content/<board>/assets/<教程目录>/`，并在 PR 自检路径。

#### 6.5 完成定义（DoD）
- [ ] `zh/en` 两个 `.mdx` 文件均已创建且可被 `PlaybookDocs` 加载
- [ ] frontmatter 完整，且中英 `slug` 一致
- [ ] 文章配图已落在 board 内 assets 子目录并成功渲染
- [ ] `npm run build` 通过

---

## Documentation Rendering System

### Overview
This project uses a unified MDX-based documentation system for four tutorial sites: Claude Code, OpenCode, Gemini CLI, and Codex. All documentation follows a consistent three-tier navigation structure.

### File Naming Convention
Documentation files must follow this naming pattern to enable automatic categorization:
```
{CategoryOrder}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx
```

### Asset Attachments Structure
All article attachments must be stored inside each board directory using tutorial-title folders:

```text
content/
  <板块名>/
    en/
    zh/
    assets/
      <教程标题>/
        <文章引用附件>
```

Requirements:
- Each board directory (for example: `claude-code`, `gemini-cli`, `opencode`, `codex`, `playbook`) must contain `en/`, `zh/`, and `assets/`.
- Use the tutorial title as the subfolder name (e.g., `API 还是包月？Gemini Pro vs. Claude Code 成本大比拼`).
- Store images and other article-referenced files in `content/<板块名>/assets/<教程标题>/`.
- Do not use a global `content/assets/` root for article attachments.

Example:
- `1. 入门与基础环境-1.1 概览与安装-Claude Code 概览_final.mdx`
- Renders as:
  - **Category**: 1 入门与基础环境
  - **SubCategory**: 1.1 概览与安装  
  - **Title**: Claude Code 概览

### MDX Requirements
- **Extension**: Use `.mdx` for all documentation files
- **Frontmatter**: Required fields include:
  ```yaml
  ---
  title: "Document Title"
  description: "Brief description"
  slug: "unique-identifier"
  date: "YYYY-MM-DD"
  tool: "Tool Name"
  ---
  ```
- **Components**: Available MDX components include:
  - `<AdPlaceholder />` - Advertisement placeholder
  - `<Note>`, `<ProTip>`, `<Warning>`, `<Problem>`, `<Solution>` - Callout boxes

### Typography & Styling
- **Container Class**: Wrap MDX content with `prose prose-slate dark:prose-invert max-w-none`
- **Tailwind Setup**: 
  - Current: CDN with typography plugin (`https://cdn.tailwindcss.com?plugins=typography`)
  - Recommended: Local Tailwind CSS with @tailwindcss/typography plugin for production stability
- **Dark Mode**: Typography classes automatically adapt via `dark:prose-invert`

### TypeScript Configuration
Add to `mdx.d.ts` or `md-content.d.ts`:
```typescript
declare module '*.mdx' {
  import type { ComponentType, ReactNode } from 'react';
  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  }>;
  export const frontmatter: Record<string, unknown>;
  export default MDXContent;
}
```

### Common Issues & Solutions

#### 1. MDX Files Not Loading
**Symptom**: "未找到可加载的文档文件" message appears
**Cause**: Glob pattern only matches `.md` not `.mdx`
**Fix**: Update ClaudeDocs.tsx:
```typescript
const mdxModules = import.meta.glob('../content/claude-code/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;
```

#### 2. Content Renders as Plain Text
**Symptom**: MDX content shows raw text, components not rendering
**Cause**: React plugin processes MDX before MDX plugin
**Fix**: In vite.config.ts, exclude MDX from React plugin:
```typescript
react({ include: /\.(js|jsx|ts|tsx)$/ }), // Remove md|mdx
```

#### 3. Typography Styles Missing
**Symptom**: Headings, code blocks, tables look unstyled
**Cause**: Tailwind Typography plugin not loaded
**Fix Options**:
- **CDN**: Use `https://cdn.tailwindcss.com?plugins=typography`
- **Local**: Install `npm install -D @tailwindcss/typography` and configure in CSS

#### 4. MDX Parse Errors
**Symptom**: Build fails with "Invalid left-hand side in prefix operation" or similar
**Cause**: MDX syntax errors (unclosed tags, malformed JSX)
**Fix**: Ensure all MDX tags are properly closed, especially custom components like `<Problem></Problem>`

### Implementation Checklist for New Sites

When adding documentation for OpenCode, Gemini CLI, or Codex:

1. **Content Structure**
   - [ ] Create content directory: `content/{site-name}/`
   - [ ] Create subdirectories: `content/{site-name}/en`, `content/{site-name}/zh`, `content/{site-name}/assets`
   - [ ] Follow naming convention: `{Order}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx`
   - [ ] Include required frontmatter in all files
   - [ ] Store article attachments under: `content/{site-name}/assets/{tutorial-title}/`

2. **Page Component** (clone from ClaudeDocs.tsx)
   - [ ] Create `pages/{Site}Docs.tsx`
   - [ ] Configure glob patterns for locale files (e.g. `../content/{site-name}/en/*.mdx` and `../content/{site-name}/zh/*.mdx`)
   - [ ] Implement three-tier sidebar parsing logic
   - [ ] Add `prose` class to content container

3. **Routing**
   - [ ] Add route in App.tsx: `<Route path="/docs/{site}" element={<SiteDocs />} />`
   - [ ] Update navigation in Layout.tsx

4. **Type Safety**
   - [ ] Ensure `mdx.d.ts` covers `*.mdx` declarations
   - [ ] Type frontmatter fields appropriately

5. **Styling Verification**
   - [ ] Verify Tailwind Typography is loaded (CDN or local)
   - [ ] Test code blocks, tables, headings render correctly
   - [ ] Check dark mode compatibility

### Cross-Site Reusable Patterns

**Shared MDX Loader Pattern**:
```typescript
// lib/docsLoader.ts
export function loadDocs(contentPath: string) {
  const modules = import.meta.glob(contentPath, { eager: true });
  // Parse filenames, extract metadata, build three-tier structure
  return processDocs(modules);
}
```

**Shared mdxComponents**:
```typescript
// components/mdxComponents.ts
export const mdxComponents = {
  AdPlaceholder,
  Note: ({ children }) => <MessageBox type="Note">{children}</MessageBox>,
  ProTip: ({ children }) => <MessageBox type="ProTip">{children}</MessageBox>,
  // ... other components
};
```

**Consistent Frontmatter Schema**:
All sites should use:
- `title`: Document title (displayed in sidebar and page)
- `description`: SEO/meta description
- `slug`: URL-friendly identifier (optional, auto-generated from filename if missing)
- `date`: Last updated date
- `tool`: Tool name for categorization

### Lessons from Claude Code Implementation

**Key Decisions:**
1. **Extension migration**: Moved from `.md` to `.mdx` for full MDX support
2. **Typography strategy**: Initially used CDN with plugin, planning migration to local Tailwind for production stability
3. **Three-tier navigation**: Implemented filename-based parsing to auto-generate Category/SubCategory/Title hierarchy
4. **Component isolation**: Separated ad components from MDX content rendering to ensure stability

**Common Pitfalls Avoided:**
- React plugin processing MDX before MDX plugin (caused parse errors)
- Missing Typography plugin (caused unstyled markdown)
- Unclosed MDX tags (caused build failures)
- Inconsistent file naming (prevented proper categorization)

**Performance Considerations:**
- MDX files are eagerly loaded (not lazy) for instant navigation
- Three-tier sidebar computed once at load, cached in component state
- Typography classes applied at container level, not per-element
