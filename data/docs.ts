import React from 'react';
import { Terminal, Cpu, Code, Bot } from 'lucide-react';
import { ToolDocs } from '../types';

export const tools: Record<string, ToolDocs> = {
  claude: {
    id: 'claude',
    icon: React.createElement(Code, { className: "w-6 h-6 text-[#D97757]" }),
    en: {
      name: 'Claude Code',
      description: "Anthropic's advanced coding assistant CLI designed for complex refactoring and reasoning tasks.",
      sections: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'installation', title: 'Installation' },
        { id: 'authentication', title: 'Authentication' },
        { id: 'usage', title: 'Usage' },
        { id: 'configuration', title: 'Configuration' },
      ]
    },
    zh: {
      name: 'Claude Code',
      description: "Anthropic 的高级代码助手 CLI，专为复杂的重构和推理任务设计。",
      sections: [
        { id: 'introduction', title: '介绍' },
        { id: 'installation', title: '安装' },
        { id: 'authentication', title: '认证' },
        { id: 'usage', title: '用法' },
        { id: 'configuration', title: '配置' },
      ]
    }
  },
  gemini: {
    id: 'gemini',
    icon: React.createElement(Cpu, { className: "w-6 h-6 text-blue-500" }),
    en: {
      name: 'Gemini CLI',
      description: "Google's multimodal AI integration for developers. Seamlessly mix code, images, and context.",
      sections: [
        { id: 'overview', title: 'Overview' },
        { id: 'setup', title: 'Setup' },
        { id: 'multimodal', title: 'Multimodal Inputs' },
        { id: 'api-reference', title: 'API Reference' },
      ]
    },
    zh: {
      name: 'Gemini CLI',
      description: "Google 的多模态 AI 集成工具。无缝混合代码、图像和上下文。",
      sections: [
        { id: 'overview', title: '概览' },
        { id: 'setup', title: '设置' },
        { id: 'multimodal', title: '多模态输入' },
        { id: 'api-reference', title: 'API 参考' },
      ]
    }
  },
  opencode: {
    id: 'opencode',
    icon: React.createElement(Terminal, { className: "w-6 h-6 text-green-500" }),
    en: {
      name: 'OpenCode',
      description: "Open-source, local-first solutions for AI-driven development. Private, secure, and customizable.",
      sections: [
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'local-models', title: 'Local Models' },
        { id: 'extensions', title: 'Extensions' },
      ]
    },
    zh: {
      name: 'OpenCode',
      description: "开源、本地优先的 AI 驱动开发解决方案。私密、安全且可定制。",
      sections: [
        { id: 'getting-started', title: '入门' },
        { id: 'local-models', title: '本地模型' },
        { id: 'extensions', title: '扩展' },
      ]
    }
  },
  codex: {
    id: 'codex',
    icon: React.createElement(Bot, { className: 'w-6 h-6 text-cyan-500' }),
    en: {
      name: 'Codex',
      description: 'OpenAI Codex documentation, workflows, tools, and integration guides.',
      sections: [
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'core-tools', title: 'Core Tools' },
        { id: 'advanced', title: 'Advanced' },
      ],
    },
    zh: {
      name: 'Codex',
      description: 'OpenAI Codex 文档、工作流、工具与集成指南。',
      sections: [
        { id: 'getting-started', title: '入门' },
        { id: 'core-tools', title: '核心工具' },
        { id: 'advanced', title: '高级' },
      ],
    },
  }
};
