import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  site: 'https://saiid.ch',
  integrations: [react(), tailwind(), sitemap()],
  vite: {
    plugins: [svgr()],
  },
});
