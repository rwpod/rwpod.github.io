import { convert } from 'html-to-text'
import { getLimitedPosts } from '@utils/posts'

export const get = async () => {
  return {
    body: JSON.stringify(
      getLimitedPosts(600).map((post) => ({
        id: post.url,
        title: post.frontmatter.title,
        content: convert(post.compiledContent(), {
          selectors: [{ selector: 'a', options: { ignoreHref: true } }]
        }),
        date: post.frontmatter.pubDate.toISOString(),
        human_date: post.frontmatter.pubDate.format('DD.MM.YYYY'),
        main_image: post.frontmatter.main_image
      }))
    )
  }
}
