import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    category: z.string().default('achievement'),
  }),
});

const blogs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blogs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    cover: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    summary: z.string(),
    cover: z.string().optional(),
    links: z.record(z.string()).optional(),
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: z.object({
    date: z.coerce.date(),
    expires: z.coerce.date().optional(),
    level: z.enum(['info', 'highlight', 'urgent']).default('highlight'),
    link: z.string().optional(),
    linkLabel: z.string().optional(),
  }),
});

export const collections = { news, blogs, projects, announcements };
