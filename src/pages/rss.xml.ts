import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const posts: CollectionEntry<'posts'>[] = (await getCollection('posts'))
    .filter((post: CollectionEntry<'posts'>) => import.meta.env.DEV || !post.data.draft)
    .sort(
      (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
        b.data.published.getTime() - a.data.published.getTime()
    );

  return rss({
    title: 'Arnav Panigrahi',
    description: 'Technical notes, project writeups, and personal essays by Arnav Panigrahi.',
    site: context.site ?? new URL('https://arnavpanigrahi.com'),
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    customData: [
      '<language>en-us</language>',
      `<atom:link href="${new URL('rss.xml', context.site ?? 'https://arnavpanigrahi.com/').toString()}" rel="self" type="application/rss+xml" />`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/posts/${post.id}/`,
      categories: post.data.categories,
      customData: `<dc:creator>${post.data.author}</dc:creator>`,
    })),
  });
};
