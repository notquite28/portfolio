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
    description: z.string(),
    author: z.string(),
    published: z.coerce.date(),
    updated: z.string().datetime().optional(),
    categories: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
