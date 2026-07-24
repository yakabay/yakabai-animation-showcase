/** Prefixes a path in /public with Vite's configured base path. */
export function asset(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}
