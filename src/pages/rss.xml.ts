import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blogs = await getCollection('blogs');

  return rss({
    title: "Saiid El Hajj Chehade's Blog",
    description: 'Blog posts about web security, privacy, and software engineering',
    site: context.site!,
    items: blogs.map((post: CollectionEntry<'blogs'>) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/blog/${post.data.slug}/`,
    })),
  });
}
