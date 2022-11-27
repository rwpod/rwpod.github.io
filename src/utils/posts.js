import dayjs from '@utils/dayjs'
import _truncate from 'lodash/truncate'
import { genPostUrl, urlForPath } from '@utils/links'

const getHeadlineTitle = (post) => (
  _truncate(post.frontmatter.title, {
    length: 20,
    separator: ' ',
    omission: ''
  })
)

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export const getMainImageAttributes = (post) => {
  const IMG_BASE_SIZE = 150

  const src = `${post.frontmatter.main_image}?width=${IMG_BASE_SIZE}&height=${IMG_BASE_SIZE}`
  const srcset = [
    `${post.frontmatter.main_image}?width=${IMG_BASE_SIZE}&height=${IMG_BASE_SIZE}`,
    `${post.frontmatter.main_image}?width=${Math.round(IMG_BASE_SIZE * 1.5)}&height=${Math.round(IMG_BASE_SIZE * 1.5)} 1.5x`,
    `${post.frontmatter.main_image}?width=${IMG_BASE_SIZE * 2}&height=${IMG_BASE_SIZE * 2} 2x`
  ].join(',')
  return {
    size: IMG_BASE_SIZE,
    src,
    srcset
  }
}

export const getPosts = () => {
  const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true })
  return Object.values(postImportResult).filter((post) => (
    !post.frontmatter.draft
  )).map((post) => {
    const pubDate = dayjs(post.frontmatter.date).utc()
    const pubYear = pubDate.format('YYYY')
    const pubMonth = pubDate.format('MM')
    const pubDay = pubDate.format('DD')
    // filenames
    const fileParts = post.file.split('/')
    const slug = fileParts[fileParts.length - 1].split('.')[0]
    // url
    const url = genPostUrl({ pubYear, pubMonth, pubDay, slug })

    return {
      ...post,
      url,
      fullUrl: urlForPath(url),
      frontmatter: {
        ...post.frontmatter,
        pubDate,
        pubYear,
        pubMonth,
        pubDay,
        slug,
        headlineTitle: getHeadlineTitle(post),
        formatedDate: pubDate.format('DD.MM.YYYY'),
        mainImage: urlForPath(post.frontmatter.main_image),
        audioSize: bytesToSize(post.frontmatter.audio_size || 0),
        audioAacSize: bytesToSize(post.frontmatter.audio_aac_size || 0)
      }
    }
  }).sort((a, b) => (
    b.frontmatter.pubDate.diff(a.frontmatter.pubDate)
  ))
}

export const getLimitedPosts = (limit = 50) => (
  getPosts().slice(0, limit)
)

export const getLimitedAacPosts = (limit = 50) => (
  getPosts().filter((post) => (
    post.frontmatter.audio_aac_url
  )).slice(0, limit)
)
