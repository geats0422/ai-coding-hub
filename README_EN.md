# AI Coding Hub (English)

[Default Chinese README](./README.md) | [中文版本](./README_ZH.md)

AI Coding Hub is a developer-focused documentation and tutorial site for AI coding tools. It currently includes `Claude Code`, `Gemini CLI`, `OpenCode`, `Codex`, and `AI Playbook` sections, with bilingual UI/content and MDX-based rendering.

## Key Features

- Multi-board documentation architecture by tool.
- Bilingual support (`zh/en`) for UI and article content.
- MDX rendering with Frontmatter and custom components (e.g. `AdPlaceholder`).
- Three-level sidebar navigation parsed from file naming conventions.
- Basic compliance pages and flows: `Privacy`, `Terms`, and cookie consent banner.
- Consent-gated ad script loading.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- React Router (`HashRouter`)
- Tailwind CSS (configured via CDN)
- MDX (`@mdx-js/rollup` + remark plugins)

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key

# Optional: ad scripts (loaded only after consent)
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSTERRA_SCRIPT_URL=https://your-adsterra-script-url.js
```

### 3) Run and build

```bash
npm run dev
npm run build
npm run preview
```

### 4) MDX table check (optional)

```bash
npm run check:mdx-tables
```

## Core Project Structure

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

## Documentation & Asset Conventions

### MDX file naming

Recommended pattern:

```text
{CategoryOrder}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx
```

Example:

```text
1. 入门与基础环境-1.1 概览与安装-Claude Code 概览_final.mdx
```

### Frontmatter (recommended)

```yaml
---
title: "Document Title"
description: "Brief description"
slug: "unique-identifier"
date: "YYYY-MM-DD"
tool: "Tool Name"
---
```

### Attachment directory rule (important)

Article attachments must be stored in each board's `assets` folder:

```text
content/
  <board-name>/
    assets/
      <tutorial-title>/
        <article attachments>
```

Example:

```text
content/claude-code/assets/API 还是包月？Gemini Pro vs. Claude Code 成本大比拼/
```

## How to Add a New Tutorial

1. Choose board + locale directory (e.g. `content/playbook/zh/`).
2. Add a new `.mdx` file using naming conventions.
3. Fill Frontmatter (`title/description/slug` at minimum).
4. Put images/files under `assets/<tutorial-title>/` for the same board.
5. Run `npm run dev` and verify sidebar structure and rendering.

## Route Map

- `/` (Home)
- `/docs/claude`
- `/docs/gemini`
- `/docs/opencode`
- `/docs/codex`
- `/docs/playbook`
- `/privacy`
- `/terms`

## Ads & Compliance (Current State)

- Cookie consent state is managed by `AdConsentContext` (`unknown/granted/denied`).
- `AdNetworkLoader` injects ad scripts only when consent is `granted`.
- `public/ads.txt`, `public/robots.txt`, and `public/sitemap.xml` exist; replace placeholders before production launch.

## Notes

- No test framework is currently configured (e.g. Vitest/Jest).
- Before production deployment, complete real domain setup, ad platform configuration, and content readiness checks.
