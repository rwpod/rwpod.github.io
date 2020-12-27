import {clientsClaim} from 'workbox-core'
import {precacheAndRoute} from 'workbox-precaching'
import {registerRoute} from 'workbox-routing'
import {NetworkFirst} from 'workbox-strategies'
import {CacheableResponsePlugin} from 'workbox-cacheable-response'
import {ExpirationPlugin} from 'workbox-expiration'
import {cleanupOutdatedCaches} from 'workbox-precaching/cleanupOutdatedCaches'

const _cachedAssets = self.__WB_MANIFEST

// const webpPlugin = {
//   requestWillFetch: async ({request}) => {
//     const {url} = request
//     // Inspect the accept header for WebP support
//     if (/\.(jpg|png)$/i.test(url) && request.headers.has('accept') && request.headers.get('accept').includes('webp')) {
//       const newUrl = new URL(`${url}.webp`)
//       return new Request(newUrl.href, {headers: request.headers})
//     }
//     return request
//   }
// }

const MIX_IMAGE_DIMENSION = 40
const MAX_IMAGE_DIMENSION = 600

const imageResizePlugin = {
  fetchDidSucceed: async ({request, response}) => {
    const requestUrl = new URL(request.url)

    if (!response.ok) {
      return response
    }

    if (!requestUrl.searchParams.has('width') || !requestUrl.searchParams.has('height')) {
      return response
    }

    const width = parseInt(requestUrl.searchParams.get('width'), 10)
    const height = parseInt(requestUrl.searchParams.get('height'), 10)

    if (width < MIX_IMAGE_DIMENSION || width > MAX_IMAGE_DIMENSION || height < MIX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      return response
    }

    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
      return response
    }

    const responseOptions = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }
    const imgBlob = await response.blob()

    try {
      const resizeQuality = 'high'
      const bitmap = await createImageBitmap(imgBlob, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality
      })
      const canvas = new OffscreenCanvas(width, height)
      const ctx = canvas.getContext('bitmaprenderer')
      if (ctx) {
        // transfer the ImageBitmap to it
        ctx.transferFromImageBitmap(bitmap)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = resizeQuality
      }
      else {
        // in case someone supports createImageBitmap only
        // twice in memory...
        canvas.getContext('2d').drawImage(bitmap, 0, 0)
      }
      const resizedImageBlob = await canvas.convertToBlob({
        type: imgBlob.type,
        quality: 0.95
      })

      return new Response(resizedImageBlob, {
        ...responseOptions,
        headers: {
          ...(responseOptions.headers || {}),
          'Content-Length': resizedImageBlob.size,
          'Content-Type': resizedImageBlob.type
        }
      })
    } catch(e) {
      console.error('Error in imageResizePlugin', e)

      return new Response(imgBlob, responseOptions)
    }
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
cleanupOutdatedCaches()

const cacheResponsePluginForAssets = new CacheableResponsePlugin({
  statuses: [0, 200]
})

const imagesPluginExpiration = new ExpirationPlugin({
  maxEntries: 20,
  maxAgeSeconds: 14 * 24 * 60 * 60, // 2 weeks
  purgeOnQuotaError: true
})

registerRoute(
  new RegExp('/images/about/.*\\.(jpg|png|webp)$', 'i'),
  new NetworkFirst({
    cacheName: 'about-images',
    networkTimeoutSeconds: 10,
    plugins: [
      cacheResponsePluginForAssets,
      imagesPluginExpiration
    ]
  })
)

registerRoute(
  new RegExp('/images/static/.*\\.(jpg|png)', 'i'),
  new NetworkFirst({
    cacheName: 'podcasts-images',
    networkTimeoutSeconds: 10,
    plugins: [
      imageResizePlugin,
      cacheResponsePluginForAssets,
      imagesPluginExpiration
    ]
  })
)

precacheAndRoute([
  {url: '/images/plyr.svg', revision: 'v1'}
], {
  ignoreURLParametersMatching: [/.*/],
  cleanUrls: false
})
