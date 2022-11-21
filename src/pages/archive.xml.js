import rss from '@astrojs/rss'
import { rssSettings, getLimitedPosts, rssItem } from '@utils/helpers'

const posts = getLimitedPosts(300)

export const get = () => rss({
  ...rssSettings({ posts, endpoint: '/archive.xml' }),
  items: posts.map(rssItem())
})
