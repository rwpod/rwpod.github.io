import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import compress from 'astro-compress'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
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
  integrations: [svelte(), AstroPWA({
    injectRegister: null,
    strategies: 'injectManifest',
    registerType: 'prompt',
    srcDir: 'src',
    filename: 'sw.js',
    base: '/',
    scope: '/',
    includeAssets: [
      'favicon.svg',
      'favicon.ico',
      'icon-192.png',
      'icon-512.png'
    ],
    injectManifest: {
      globPatterns: ['**/*.{css,js}']
    },
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'RWpod',
      short_name: 'RWpod',
      description: 'RWpod - подкаст про Ruby та Web технології (для тих, кому подобається мислити в Ruby стилі)',
      theme_color: '#e2dbcb',
      icons: [
        {
          'src': '/icon-192.png',
          'type': 'image/png',
          'sizes': '192x192'
        },
        {
          'src': '/icon-512.png',
          'type': 'image/png',
          'sizes': '512x512'
        }
      ]
    }
  }), sitemap({
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
