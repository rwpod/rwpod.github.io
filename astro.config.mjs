import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import compress from 'astro-compress'
import sitemap from '@astrojs/sitemap'
// import swPlugin from './plugins/swPlugin.mjs'
import readmoreRemarkPlugin from './plugins/remark/readmore.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.rwpod.com',
  base: '/',
  integrations: [svelte(), sitemap({
    changefreq: 'weekly',
    priority: 0.7
  }), compress({
    img: false,
    svg: false
  })],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [readmoreRemarkPlugin]
  },
  build: {
    format: 'file'
  },
  vite: {
    plugins: [yaml()]
  }
})
