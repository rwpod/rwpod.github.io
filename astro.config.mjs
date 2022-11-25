import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import compress from 'astro-compress'
import sitemap from '@astrojs/sitemap'
// import swPlugin from './plugins/swPlugin.mjs'
import readmoreRemarkPlugin from './plugins/remark/readmore.mjs'
import rehypeExternalLinks from 'rehype-external-links'

const SITE = 'https://www.rwpod.com/'

const pageRoute = (path) => (
  path === SITE ? path : `${path}.html`
)

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [svelte(), sitemap({
    filter: (page) => page !== `${SITE}/archives`,
    serialize: (item) => ({
      ...item,
      url: pageRoute(item.url)
    }),
    changefreq: 'weekly',
    priority: 0.7
  }), compress({
    img: false,
    svg: false
  })],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [readmoreRemarkPlugin],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }]
    ]
  },
  build: {
    format: 'file'
  },
  vite: {
    plugins: [yaml()]
  }
})
