import crypto from 'node:crypto'
import _truncate from 'lodash/truncate'
import { getLimitedPosts } from '@utils/posts'

const hash = (input) => (
  crypto.createHash('sha256').update(input).digest('hex')
)

export const get = async () => {
  return {
    body: JSON.stringify(getLimitedPosts(100).map((post) => ({
      id: hash(post.fullUrl),
      title: post.frontmatter.title,
      summary: _truncate(post.frontmatter.summaryText, { length: 150, omission: '...' }),
      description: post.compiledContent(),
      date: post.frontmatter.pubDate.toISOString(),
      human_date: post.frontmatter.pubDate.format('DD.MM.YYYY'),
      link: post.fullUrl,
      main_img: post.frontmatter.mainImage,
      audio_url: post.frontmatter.audio_url,
      audio_file_size: post.frontmatter.audio_size,
      audio_type: 'audio/mpeg',
      audio_duration: post.frontmatter.duration
    })))
  }
}
