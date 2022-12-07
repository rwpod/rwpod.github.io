import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import compress from 'astro-compress'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
import rehypeExternalLinks from 'rehype-external-links'

const SITE = 'https://www.rwpod.com/'

const pageRoute = path => (
  path === SITE ? path : `${path}.html`
)

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [svelte(), sitemap({
    filter: page => page !== `${SITE}/archives`,
    serialize: item => ({
      ...item,
      url: pageRoute(item.url)
    }),
    changefreq: 'weekly',
    priority: 0.7
  }), AstroPWA({
    injectRegister: null,
    strategies: 'injectManifest',
    registerType: 'prompt',
    srcDir: 'src',
    filename: 'sw.js',
    base: '/',
    scope: '/',
    includeAssets: ['favicon.svg', 'favicon.ico', 'icon-192.png', 'icon-512.png', 'maskable_icon.png', 'images/plyr.svg', 'images/logo.svg'],
    injectManifest: {
      globPatterns: ['**/*.{css,js}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    manifest: {
      name: 'RWpod',
      short_name: 'RWpod',
      description: 'RWpod - подкаст про Ruby та Web технології (для тих, кому подобається мислити в Ruby стилі)',
      theme_color: '#e2dbcb',
      icons: [{
        'src': '/icon-192.png',
        'type': 'image/png',
        'sizes': '192x192'
      }, {
        'src': '/icon-512.png',
        'type': 'image/png',
        'sizes': '512x512'
      }, {
        'src': '/maskable_icon.png',
        'type': 'image/png',
        'sizes': '1024x1024',
        'purpose': 'maskable'
      }]
    }
  }), compress({
    css: true,
    html: true,
    js: true,
    img: false,
    svg: false
  })],
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [[rehypeExternalLinks, {
      target: '_blank',
      rel: 'noopener noreferrer'
    }]]
  },
  build: {
    format: 'file'
  },
  vite: {
    plugins: [yaml()],
    build: {
      cssCodeSplit: false,
      minify: 'esbuild'
    }
  }
})
