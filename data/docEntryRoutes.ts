export const docEntryRoutes = {
  claude: '/docs/claude/claude-code-overview',
  gemini: '/docs/gemini/quickstart-installation',
  opencode: '/docs/opencode/opencode-intro',
  codex: '/docs/codex/authentication',
  playbook: '/docs/playbook/claude-code-token-context-surgery',
} as const;

export const getDocEntryRoute = (toolId: string): string => {
  if (toolId === 'claude') {
    return docEntryRoutes.claude;
  }

  if (toolId === 'gemini') {
    return docEntryRoutes.gemini;
  }

  if (toolId === 'opencode') {
    return docEntryRoutes.opencode;
  }

  if (toolId === 'codex') {
    return docEntryRoutes.codex;
  }

  if (toolId === 'playbook') {
    return docEntryRoutes.playbook;
  }

  return docEntryRoutes.claude;
};
