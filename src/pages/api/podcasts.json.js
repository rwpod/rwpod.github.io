import crypto from 'node:crypto'
import _truncate from 'lodash/truncate'
import { getLimitedPosts } from '@utils/posts'

const hash = (input) => crypto.createHash('sha256').update(input).digest('hex')

export const get = async () => {
  const posts = await getLimitedPosts(100)

  return {
    body: JSON.stringify(
      posts.map((post) => ({
        id: hash(post.urlWithDomain),
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
  }
}
