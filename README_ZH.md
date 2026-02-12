# AI Coding Hub（中文）

[默认中文 README](./README.md) | [English Version](./README_EN.md)

AI Coding Hub 是一个面向开发者的 AI 编程工具教程与文档站点，当前覆盖 `Claude Code`、`Gemini CLI`、`OpenCode`、`Codex` 和 `AI Playbook`（技巧手册）板块，支持中英双语切换与 MDX 内容渲染。

## 主要特性

- 多板块文档系统：按工具拆分页面与内容目录。
- 中英双语：全站 UI 文案和文档内容支持 `zh/en`。
- MDX 文档渲染：支持 Frontmatter + 自定义组件（如 `AdPlaceholder`）。
- 三层侧边栏导航：按文件名规则自动解析分类结构。
- 站点基础合规：已提供 `Privacy`、`Terms` 页面与 Cookie 同意弹窗。
- 广告脚本可控加载：仅在用户同意后尝试注入广告网络脚本。

## 技术栈

- React 19 + TypeScript
- Vite 6
- React Router（`HashRouter`）
- Tailwind CSS（通过 CDN 配置）
- MDX（`@mdx-js/rollup` + remark 插件链）

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量

在项目根目录创建 `.env.local`：

```bash
GEMINI_API_KEY=your_gemini_api_key

# 可选：广告脚本（仅同意后加载）
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSTERRA_SCRIPT_URL=https://your-adsterra-script-url.js
```

### 3) 启动与构建

```bash
npm run dev
npm run build
npm run preview
```

### 4) MDX 表格检查（可选）

```bash
npm run check:mdx-tables
```

## 目录结构（核心）

```text
.
├── components/
├── context/
├── data/
├── pages/
├── content/
│   ├── claude-code/
│   │   ├── en/
│   │   ├── zh/
│   │   └── assets/
│   ├── gemini-cli/
│   │   ├── en/
│   │   ├── zh/
│   │   └── assets/
│   ├── opencode/
│   │   ├── en/
│   │   ├── zh/
│   │   └── assets/
│   ├── codex/
│   │   ├── en/
│   │   ├── zh/
│   │   └── assets/
│   └── playbook/
│       ├── en/
│       ├── zh/
│       └── assets/
├── public/
├── App.tsx
└── index.tsx
```

## 文档与附件规范

### MDX 命名规范

推荐使用：

```text
{CategoryOrder}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx
```

示例：

```text
1. 入门与基础环境-1.1 概览与安装-Claude Code 概览_final.mdx
```

### Frontmatter（建议完整填写）

```yaml
---
title: "Document Title"
description: "Brief description"
slug: "unique-identifier"
date: "YYYY-MM-DD"
tool: "Tool Name"
---
```

### 附件目录规范（重点）

附件必须放在对应板块内部的 `assets` 目录：

```text
content/
  <板块名>/
    assets/
      <教程标题>/
        <文章引用附件>
```

示例：

```text
content/claude-code/assets/API 还是包月？Gemini Pro vs. Claude Code 成本大比拼/
```

## 新增教程内容流程

1. 选择板块与语言目录（如 `content/playbook/zh/`）。
2. 新建 `.mdx` 并按命名规范命名。
3. 填写 Frontmatter（至少 `title/description/slug`）。
4. 若有图片等资源，放入对应板块的 `assets/<教程标题>/`。
5. 启动 `npm run dev` 检查渲染与侧边栏结构。

## 路由一览

- `/`：首页
- `/docs/claude`
- `/docs/gemini`
- `/docs/opencode`
- `/docs/codex`
- `/docs/playbook`
- `/privacy`
- `/terms`

## 广告与合规说明（当前实现）

- Cookie 同意状态由 `AdConsentContext` 管理（`unknown/granted/denied`）。
- `AdNetworkLoader` 仅在 `granted` 时读取环境变量并尝试注入脚本。
- 已提供 `public/ads.txt`、`public/robots.txt`、`public/sitemap.xml`，上线前请替换为真实内容（域名、发布商 ID）。

## 说明

- 当前仓库未配置测试框架（如 Vitest/Jest）。
- 生产部署前请完成真实域名、广告平台配置与内容审核准备。
