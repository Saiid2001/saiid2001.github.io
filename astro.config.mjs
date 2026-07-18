import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import svgr from 'vite-plugin-svgr';
import { NOINDEX_PATHS } from './src/config/noindex.mjs';

export default defineConfig({
  site: 'https://saiid.ch',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) =>
        !NOINDEX_PATHS.some((prefix) => new URL(page).pathname.startsWith(prefix)),
    }),
  ],
  vite: {
    plugins: [svgr()],
  },
});
