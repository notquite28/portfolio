import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const site = context.site ?? new URL('https://arnavpanigrahi.com/');
  const posts: CollectionEntry<'posts'>[] = (await getCollection('posts'))
    .filter((post: CollectionEntry<'posts'>) => import.meta.env.DEV || !post.data.draft)
    .sort(
      (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
        b.data.published.getTime() - a.data.published.getTime()
    );

  const modified = (post: CollectionEntry<'posts'>): Date =>
    post.data.updated ? new Date(post.data.updated) : post.data.published;
  const latestPost = posts[0] ? modified(posts[0]) : undefined;

  const urls: Array<{ loc: string; lastmod?: Date }> = [
    { loc: '/' },
    { loc: '/posts/', lastmod: latestPost },
    ...posts.map((post: CollectionEntry<'posts'>) => ({
      loc: `/posts/${post.id}/`,
      lastmod: modified(post),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${new URL(url.loc, site).toString()}</loc>${
        url.lastmod ? `\n    <lastmod>${url.lastmod.toISOString()}</lastmod>` : ''
      }\n  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
