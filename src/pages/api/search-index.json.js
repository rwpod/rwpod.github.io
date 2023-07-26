import { convert } from 'html-to-text'
import { getLimitedPosts } from '@utils/posts'

export const get = async () => {
  const posts = await getLimitedPosts(600)

  return {
    body: JSON.stringify(
      posts.map((post) => ({
        id: post.url,
        title: post.data.title,
        content: convert(post.htmlContent, {
          selectors: [{ selector: 'a', options: { ignoreHref: true } }]
        }),
        date: post.data.pubDate.toISOString(),
        human_date: post.data.pubDate.format('DD.MM.YYYY'),
        main_image: post.data.main_image
      }))
    )
  }
}
