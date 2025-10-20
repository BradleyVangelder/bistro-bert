/**
 * Combines class names into a single string
 * Filters out falsy values and merges strings properly
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}