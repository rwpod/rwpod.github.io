import { getCollection } from 'astro:content'
import { marked } from 'marked'
import dayjs from '@utils/dayjs'
import _truncate from 'lodash/truncate'
import { convert } from 'html-to-text'
import { genPostUrl, urlForPath } from '@utils/links'

const getHeadlineTitle = (post) =>
  _truncate(post.data.title, {
    length: 20,
    separator: ' ',
    omission: ''
  })

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

export const getCoverAttributes = (post) => {
  const IMG_BASE_SIZE = 150

  const src = `${post.data.cover}?width=${IMG_BASE_SIZE}&height=${IMG_BASE_SIZE}`
  const srcset = [
    `${post.data.cover}?width=${IMG_BASE_SIZE}&height=${IMG_BASE_SIZE}`,
    `${post.data.cover}?width=${Math.round(IMG_BASE_SIZE * 1.5)}&height=${Math.round(
      IMG_BASE_SIZE * 1.5
    )} 1.5x`,
    `${post.data.cover}?width=${IMG_BASE_SIZE * 2}&height=${IMG_BASE_SIZE * 2} 2x`
  ].join(',')
  return {
    size: IMG_BASE_SIZE,
    src,
    srcset
  }
}

export const getPosts = async () => {
  const postsResult = await getCollection('posts', ({ data }) => (
    import.meta.env.PROD ? data.draft !== true : true
  ))
  return postsResult
    .map((post) => {
      const pubDate = dayjs(post.data.date).utc()
      const pubYear = pubDate.format('YYYY')
      const pubMonth = pubDate.format('MM')
      const pubDay = pubDate.format('DD')
      // filenames
      const slugParts = post.slug.split('/')
      const slug = slugParts[slugParts.length - 1]
      // url
      const urlParams = { pubYear, pubMonth, pubDay, slug }
      const url = genPostUrl(urlParams)
      const htmlContent = marked.parse(post.body, {
        gfm: true,
        mangle: false,
        headerIds: false
      })

      return {
        ...post,
        url,
        urlWithDomain: urlForPath(url),
        htmlContent,
        textContent: convert(htmlContent),
        urlParams,
        data: {
          ...post.data,
          pubDate,
          pubYear,
          pubMonth,
          pubDay,
          headlineTitle: getHeadlineTitle(post),
          formatedDate: pubDate.format('DD.MM.YYYY'),
          coverWithDomain: urlForPath(post.data.cover),
          audioSize: bytesToSize(post.data.audio_size || 0),
          audioAacSize: bytesToSize(post.data.audio_aac_size || 0)
        }
      }
    })
    .sort((a, b) => b.data.pubDate.diff(a.data.pubDate))
}

export const getLimitedPosts = async (limit = 50) => {
  const posts = await getPosts()
  return posts.slice(0, limit)
}

export const getLimitedAacPosts = async (limit = 50) => {
  const posts = await getPosts()
  return posts.filter((post) => !!post.data.audio_aac_url).slice(0, limit)
}
