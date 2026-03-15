export const docEntryRoutes = {
  claude: '/docs/claude/claude-code-overview',
  gemini: '/docs/gemini/quickstart-installation',
  opencode: '/docs/opencode/opencode-intro',
  codex: '/docs/codex/authentication',
  playbook: '/docs/playbook/claude-code-token-context-surgery',
} as const;

export type DocCategory = keyof typeof docEntryRoutes;

export const isDocCategory = (value: string): value is DocCategory => value in docEntryRoutes;

export const getOptionalDocEntryRoute = (toolId: string): string | null => {
  return isDocCategory(toolId) ? docEntryRoutes[toolId] : null;
};

export const getDocEntryRoute = (toolId: string): string => {
  return getOptionalDocEntryRoute(toolId) ?? docEntryRoutes.claude;
};
