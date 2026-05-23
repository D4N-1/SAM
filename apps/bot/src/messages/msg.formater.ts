export function formatMessage( template: string, variables: Record<string, string | number> ): string {
  return template.replace(/{(.*?)}/g, (_, key) => {
    return String(variables[key] ?? `{${key}}`);
  });
}