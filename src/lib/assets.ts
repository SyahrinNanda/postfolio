/**
 * Helper to resolve static asset paths correctly when deploying to subpaths
 * like GitHub Pages (e.g. /postfolio/assets/...) vs root domain (localhost:3000).
 */
export function getAssetPath(path: string | null | undefined): string {
  if (!path) return '';
  
  // Ignore external URLs, data URLs, mailto, tel
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If already prefixed with basePath, return as is
  if (basePath && cleanPath.startsWith(basePath)) {
    return cleanPath;
  }

  return `${basePath}${cleanPath}`;
}

