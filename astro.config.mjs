import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'
import yaml from '@rollup/plugin-yaml'
import { defineHastPlugin } from "satteri"
import { satteri } from '@astrojs/markdown-satteri'
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

const SITE = 'https://www.rwpod.com/'

const mdExternalLinks = defineHastPlugin({
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties.href;
      if (typeof href === "string" && href.startsWith("http")) {
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener noreferrer");
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [
    icon(),
    svelte(),
    sitemap({
      filter: (page) => page !== `${SITE}/archives`,
      xslURL: '/rss/sitemap.xsl',
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date()
    }),
    AstroPWA({
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
        'icon-512.png',
        'maskable_icon.png',
        'images/plyr.svg'
      ],
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
        description:
          'RWpod - подкаст про Ruby та Web технології (для тих, кому подобається мислити в Ruby стилі)',
        theme_color: '#e2dbcb',
        icons: [
          {
            src: '/icon-192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: '/icon-512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: '/maskable_icon.png',
            type: 'image/png',
            sizes: '1024x1024',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  markdown: {
    processor: satteri({
      hastPlugins: [mdExternalLinks],
      features: {
        gfm: true,
        frontmatter: true,
      },
    })
  },
  compressHTML: true,
  build: {
    assets: 'assets',
    format: 'file',
    inlineStylesheets: 'never'
  },
  server: { port: 3000 },
  vite: {
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(
          browserslist('>0.3%', 'Firefox ESR', 'not dead', 'not ie 11', 'not op_mini all')
        )
      }
    },
    plugins: [yaml()],
    build: {
      cssCodeSplit: false,
      minify: 'esbuild'
    }
  }
})
