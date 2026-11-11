/**
 * Server-side helper. Kept out of site.config.ts on purpose: the browser bundle imports
 * that file, and the literal marker must never appear in shipped JavaScript.
 */
export function isPlaceholder(value: string): boolean {
  return value.includes('PLACEHOLDER');
}
