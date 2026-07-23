export function normalizeHashPath(hash: string): string {
  return hash
    .replace(/^#\/?/, '')
    .replace(/\/+$/, '');
}
