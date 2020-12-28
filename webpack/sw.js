import {clientsClaim} from 'workbox-core'
import {precacheAndRoute} from 'workbox-precaching'
import {registerRoute} from 'workbox-routing'
import {StaleWhileRevalidate} from 'workbox-strategies'
import {ExpirationPlugin} from 'workbox-expiration'
import {cleanupOutdatedCaches} from 'workbox-precaching/cleanupOutdatedCaches'

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

const getImageUrlAndSizes = (url) => {
  const requestUrl = new URL(url)

  if (!requestUrl.searchParams.has('width') || !requestUrl.searchParams.has('height')) {
    return [requestUrl, null, null]
  }

  const width = parseInt(requestUrl.searchParams.get('width'), 10)
  const height = parseInt(requestUrl.searchParams.get('height'), 10)

  if (width < MIX_IMAGE_DIMENSION || width > MAX_IMAGE_DIMENSION || height < MIX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    return [requestUrl, null, null]
  }

  requestUrl.searchParams.delete('width')
  requestUrl.searchParams.delete('height')

  return [requestUrl.toString(), width, height]
}

const imageResizePlugin = {
  requestWillFetch: async ({request, state}) => {
    const [requestUrl, width, height] = getImageUrlAndSizes(request.url)
    if (!width || !height) {
      return request
    }

    state.imageResize = {width, height}

    return new Request(requestUrl, {
      bodyUsed: request.bodyUsed,
      cache: request.cache,
      credentials: request.credentials,
      destination: request.destination,
      headers: request.headers,
      integrity: request.integrity,
      method: request.method,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      body: request.body
    })
  },
  handlerWillRespond: async ({response, state}) => {
    if (!response.ok) {
      return response
    }

    if (!state.imageResize) {
      return response
    }

    const {width, height} = state.imageResize

    if (!width || !height) {
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
  },
  cacheKeyWillBeUsed: async ({request}) => {
    const [requestUrl, width, height] = getImageUrlAndSizes(request.url)
    if (!width || !height) {
      return request
    }

    return requestUrl
  },
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
cleanupOutdatedCaches()

const imagesPluginExpiration = new ExpirationPlugin({
  maxEntries: 20,
  maxAgeSeconds: 28 * 24 * 60 * 60, // 4 weeks
  purgeOnQuotaError: true
})

registerRoute(
  new RegExp('/images/about/.*\\.(jpg|png|webp)$', 'i'),
  new StaleWhileRevalidate({
    cacheName: 'about-images',
    networkTimeoutSeconds: 10,
    plugins: [
      imagesPluginExpiration
    ]
  })
)

registerRoute(
  ({url, request, event}) => (
    url.origin === location.origin && (new RegExp('/images/static/.*\\.(jpg|png)$', 'i')).test(url.pathname)
  ),
  new StaleWhileRevalidate({
    cacheName: 'podcast-posters',
    networkTimeoutSeconds: 10,
    plugins: [
      imageResizePlugin,
      imagesPluginExpiration
    ]
  })
)

const cachedFiles = self.__WB_MANIFEST

precacheAndRoute([
  ...cachedFiles,
  {url: '/images/plyr.svg', revision: 'v1'}
], {
  ignoreURLParametersMatching: [/.*/],
  cleanUrls: false
})

