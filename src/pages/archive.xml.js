import rss from '@astrojs/rss'
import { rssSettings, getRssPosts, rssItem } from '@utils/helpers'

const posts = getRssPosts({ limit: 300 })

export const get = () => rss({
  ...rssSettings({ posts, endpoint: '/archive.xml' }),
  items: posts.map(rssItem())
})
