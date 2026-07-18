// Path prefixes excluded from sitemap and disallowed in robots.txt.
// Pages under these prefixes should also set `noIndex` on BaseLayout so
// the rendered HTML carries a `<meta name="robots" content="noindex,...">` tag.
export const NOINDEX_PATHS = ['/hotpets/'];

export function isNoIndexPath(pathname) {
  return NOINDEX_PATHS.some((prefix) => pathname.startsWith(prefix));
}
