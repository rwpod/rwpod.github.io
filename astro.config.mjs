import { defineConfig, sharpImageService } from 'astro/config'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
import rehypeExternalLinks from 'rehype-external-links'

const SITE = 'https://www.rwpod.com/'

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [svelte(), sitemap({
    filter: page => page !== `${SITE}/archives`,
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
  })],
  markdown: {
    gfm: true,
    extendDefaultPlugins: true,
    rehypePlugins: [[rehypeExternalLinks, {
      target: '_blank',
      rel: 'noopener noreferrer'
    }]]
  },
  compressHTML: true,
  build: {
    assets: 'assets',
    format: 'file',
    inlineStylesheets: 'never'
  },
  vite: {
    plugins: [yaml()],
    build: {
      cssCodeSplit: false,
      minify: 'esbuild'
    }
  },
  image: {
    service: sharpImageService()
  },
  experimental: {
    assets: true
  }
})
