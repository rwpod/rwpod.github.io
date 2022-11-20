import { join } from 'node:path'
import { InjectManifest } from 'workbox-build'

const PKG_NAME = 'astrojs-service-worker'

const swPlugin = (options = {}) => {
  const SW_NAME = 'sw.js'

  return {
    name: PKG_NAME,
    hooks: {
      'astro:config:setup': ({ command, injectRoute, injectScript }) => {
        const isDevelopment = command === 'dev'

        injectScript('head-inline', `\
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/${SW_NAME}');
}`)

        if (isDevelopment) {
          injectRoute({
            pattern: `/${SW_NAME}`,
            entryPoint: new URL('./sw.js.js', import.meta.url).pathname
          })
        }
      },
      'astro:build:done': async ({ dir }) => {
        const out = dir.pathname
        try {
          await InjectManifest({
            swSrc: new URL('./sw.js.js', import.meta.url).pathname,
            swDest: join(out, SW_NAME),
            compileSrc: true,
            maximumFileSizeToCacheInBytes: 15730000
          })
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
export default swPlugin
