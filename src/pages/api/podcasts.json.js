import _truncate from 'lodash/truncate'
import { getLimitedPosts } from '@utils/posts'

const hash = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const GET = async () => {
  const posts = await getLimitedPosts(100)

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        id: hash(post.urlWithDomain).toString(),
        title: post.data.title,
        summary: _truncate(post.textContent, { length: 150, omission: '...' }),
        description: post.htmlContent,
        date: post.data.pubDate.toISOString(),
        human_date: post.data.pubDate.format('DD.MM.YYYY'),
        link: post.urlWithDomain,
        cover: post.data.coverWithDomain,
        audio_url: post.data.audio_url,
        audio_file_size: post.data.audio_size,
        audio_type: 'audio/mpeg',
        audio_duration: post.data.duration
      }))
    )
  )
}
