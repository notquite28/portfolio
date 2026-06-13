import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

const posts = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(50).max(160),
    author: z.string().min(1),
    published: z.coerce.date(),
    updated: z.string().datetime().optional(),
    draft: z.boolean().default(false),
    categories: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { posts };
