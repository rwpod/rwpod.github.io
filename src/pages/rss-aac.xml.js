import rss from '@astrojs/rss'
import { getLimitedAacPosts } from '@utils/posts'
import { rssSettings, rssItem } from '@utils/rss'

const posts = getLimitedAacPosts()

export const get = () =>
  rss({
    ...rssSettings({ latestPost: posts[0], endpoint: '/rss-aac.xml' }),
    items: posts.map(rssItem({ audioType: 'aac' })),
    trailingSlash: false
  })
