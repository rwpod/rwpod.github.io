import rss from '@astrojs/rss'
import { rssSettings, getLimitedPosts, rssItem } from '@utils/helpers'

const posts = getLimitedPosts()

export const get = () => rss({
  ...rssSettings({ posts }),
  items: posts.map(rssItem())
})
