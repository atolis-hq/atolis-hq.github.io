export function normalizeHashPath(hash: string): string {
  return hash
    .replace(/^#\/?/, '')
    .replace(/\/+$/, '');
}

export function normalizePathRoute(pathname: string): string {
  const [firstSegment = ''] = pathname
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .split('/');

  return firstSegment === 'index.html' ? '' : firstSegment;
}
