import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

const posts = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    published: z.coerce.date(),
    updated: z.string().datetime().optional(),
    source: z.string().url(),
    guid: z.string().url(),
    categories: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
