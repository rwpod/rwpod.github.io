import dayjs from '@utils/dayjs'
import { genPostUrl, urlForPath } from '@utils/links'

export const getPosts = () => {
  const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true })
  return Object.values(postImportResult).filter((post) => (
    !post.frontmatter.draft
  )).map((post) => {
    const pubDate = dayjs(post.frontmatter.date).utc()
    const pubYear = pubDate.year().toString()
    const pubMonth = (pubDate.month() + 1).toString().padStart(2, '0')
    const pubDay = pubDate.date().toString().padStart(2, '0')
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
        mainImage: urlForPath(post.frontmatter.main_image)
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
