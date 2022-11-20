import dayjs from '@utils/dayjs'

export const DEFAULT_TITLE = 'RWpod - подкаст про Ruby та Web технології'
export const DEFAULT_KEYWORDS = 'RWpod, Ruby, Web, подкаст, украхїнською, розробка'
export const DEFAULT_DESCRIPTION = 'RWpod - подкаст про Ruby та Web технології (для тих, кому подобається мислити в Ruby стилі)'
export const DEFAULT_AUTHOR = 'RWPod команда'
export const DEFAULT_COPYRIGHT = 'Copyright RWpod'
export const CONTACT_EMAIL = 'rwpod.com@gmail.com'
export const THEME_COLOR = '#e2dbcb'

export const rssSettings = ({ posts = [] } = {}) => {
  const nowIsoDate = dayjs().toISOString()
  const lastPubDate = posts.length > 0 ? (
    posts[0]?.pubDate?.toISOString() || nowIsoDate
  ) : nowIsoDate

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
      `<copyright>${DEFAULT_COPYRIGHT}</copyright>`,
      `<pubDate>${lastPubDate}</pubDate>`,
      `<lastBuildDate>${dayjs().toISOString()}</lastBuildDate>`,
      '<ttl>1440</ttl>',
      // link
      `<atom:link href="${import.meta.env.SITE}rss.xml" rel="self" type="application/rss+xml"/>`,
      // itunes
      `<itunes:author>${DEFAULT_AUTHOR}</itunes:author>`,
      `<itunes:keywords>${DEFAULT_KEYWORDS}</itunes:keywords>`,
      `<itunes:image href="${import.meta.env.SITE}images/logo.png"/>`,
      '<itunes:owner>',
      `<itunes:name>${DEFAULT_AUTHOR}</itunes:name>`,
      `<itunes:email>${CONTACT_EMAIL}</itunes:email>`,
      '</itunes:owner>',
      '<itunes:block>no</itunes:block>',
      '<itunes:explicit>no</itunes:explicit>',
      '<itunes:category text="Technology"/>',
      // media
      '<media:copyright url="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International.</media:copyright>',
      `<media:thumbnail url="${import.meta.env.SITE}images/logo.png"/>`,
      `<media:keywords>${DEFAULT_KEYWORDS}</media:keywords>`,
      '<media:category scheme="http://www.itunes.com/dtds/podcast-1.0.dtd">Technology</media:category>',
      // google
      `<googleplay:author>${DEFAULT_AUTHOR}</googleplay:author>`,
      `<googleplay:owner>${CONTACT_EMAIL}</googleplay:owner>`,
      `<googleplay:image href="${import.meta.env.SITE}images/logo.png"/>`,
      '<googleplay:block>no</googleplay:block>',
      '<googleplay:explicit>no</googleplay:explicit>',
      '<googleplay:category text="Technology"/>',
      // creative common
      '<creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>'
    ].join('')
  }
}

export const getRssPosts = ({ limit = 50 } = {}) => {
  const postImportResult = import.meta.glob('./posts/**/*.md', { eager: true })
  return Object.values(postImportResult).map((post) => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      pubDate: dayjs(post.frontmatter.date, 'YYYY-MM-DD', true)
    }
  })).sort((a, b) => b.valueOf() - a.valueOf()).slice(0, limit)
}

export const rssItem = () => (post) => ({
  link: post.url,
  title: post.frontmatter.title,
  pubDate: post.frontmatter.pubDate.toISOString()
})
