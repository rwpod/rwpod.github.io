import rss from '@astrojs/rss'
import dayjs from '@utils/dayjs'

const postImportResult = import.meta.glob('./posts/**/*.md', { eager: true })
const posts = Object.values(postImportResult)

const firstPostDate = posts.length > 0 ? posts[0].date : dayjs().toISOString()

export const get = () => rss({
  title: 'Buzz’s Blog',
  description: 'A humble Astronaut’s guide to the stars',
  site: import.meta.env.SITE,
  stylesheet: '/rss/styles.xsl',
  xmlns: {
    itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    googleplay: 'http://www.google.com/schemas/play-podcasts/1.0',
    media: 'http://search.yahoo.com/mrss/',
    creativeCommons: 'http://backend.userland.com/creativeCommonsRssModule',
    atom: 'http://www.w3.org/2005/Atom',
    content: 'http://purl.org/rss/1.0/modules/content/'
  },
  customData: [
    '<language>uk</language>',
    `<link>${import.meta.env.SITE}</link>`,
    '<copyright>Copyright RWpod.</copyright>',
    `<pubDate>${firstPostDate}</pubDate>`,
    `<lastBuildDate>${dayjs().toISOString()}</lastBuildDate>`,
    '<ttl>1440</ttl>',
    `<atom:link href="${import.meta.env.SITE}/rss.xml" rel="self" type="application/rss+xml"/>`,
    '<creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>'
  ].join(''),
  items: posts.map((post) => ({
    link: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.date
  }))
})

  // ```
  //   <itunes:author>RWpod команда</itunes:author>
  //   <itunes:keywords>RWpod, Ruby, Web, подкаст, русский подкаст, скринкасты, программирование</itunes:keywords>
  //   <itunes:image href="https://www.rwpod.com/images/logo.png"/>
  //   <itunes:owner>
  //     <itunes:name>RWpod команда</itunes:name>
  //     <itunes:email>rwpod.com@gmail.com</itunes:email>
  //   </itunes:owner>
  //   <itunes:block>no</itunes:block>
  //   <itunes:explicit>no</itunes:explicit>
  //   <itunes:category text="Technology"/>
  //   <media:copyright url="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International.</media:copyright>
  //   <media:thumbnail url="https://www.rwpod.com/images/logo.png"/>
  //   <media:keywords>RWpod, Ruby, Web, подкаст, русский подкаст, скринкасты, программирование</media:keywords>
  //   <media:category scheme="http://www.itunes.com/dtds/podcast-1.0.dtd">Technology</media:category>
  //   <googleplay:author>RWpod команда</googleplay:author>
  //   <googleplay:owner>rwpod.com@gmail.com</googleplay:owner>
  //   <googleplay:image href="https://www.rwpod.com/images/logo.png"/>
  //   <googleplay:block>no</googleplay:block>
  //   <googleplay:explicit>no</googleplay:explicit>
  //   <googleplay:category text="Technology"/>
  //   <creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>
  //   ```
