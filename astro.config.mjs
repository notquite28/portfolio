// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://arnavpanigrahi.com',
  base: '/',
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'ignore'
});
