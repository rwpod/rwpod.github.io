import rss from '@astrojs/rss'
import { getLimitedPosts } from '@utils/posts'
import { rssSettings, rssItem } from '@utils/rss'

const posts = await getLimitedPosts(500)

export const GET = () =>
  rss({
    ...rssSettings({ latestPost: posts[0], endpoint: '/archive.xml' }),
    items: posts.map(rssItem()),
    trailingSlash: false
  })
