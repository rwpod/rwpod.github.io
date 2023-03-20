import rss from '@astrojs/rss'
import { getLimitedPosts } from '@utils/posts'
import { rssSettings, rssItem } from '@utils/rss'

const posts = getLimitedPosts()

export const get = () => rss({
  ...rssSettings({ latestPost: posts[0] }),
  items: posts.map(rssItem()),
  trailingSlash: false
})
