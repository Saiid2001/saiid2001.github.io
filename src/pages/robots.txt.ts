import type { APIContext } from 'astro';
import { NOINDEX_PATHS } from '../config/noindex.mjs';

export async function GET({ site }: APIContext) {
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...NOINDEX_PATHS.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).toString()}`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain' },
  });
}
