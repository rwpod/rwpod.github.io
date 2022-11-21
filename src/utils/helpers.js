import dayjs from '@utils/dayjs'
import _truncate from 'lodash/truncate'

export const DEFAULT_TITLE = 'RWpod - подкаст про Ruby та Web технології'
export const DEFAULT_KEYWORDS = 'RWpod, Ruby, Web, подкаст, украхїнською, розробка'
export const DEFAULT_DESCRIPTION = 'RWpod - подкаст про Ruby та Web технології (для тих, кому подобається мислити в Ruby стилі)'
export const DEFAULT_AUTHOR = 'RWPod команда'
export const DEFAULT_COPYRIGHT = 'Copyright RWpod'
export const CONTACT_EMAIL = 'rwpod.com@gmail.com'
export const THEME_COLOR = '#e2dbcb'
export const RFC822_DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

export const pageRoute = (path) => (
  path === '/' ? path : `${path}.html`
)

export const urlForPath = (path) => (
  (new URL(path, import.meta.env.SITE)).toString()
)

export const genPostUrl = ({ pubYear, pubMonth, pubDay, slug }) => (
  pageRoute(`/posts/${pubYear}/${pubMonth}/${pubDay}/${slug}`)
)

export const getPosts = () => {
  const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true })
  return Object.values(postImportResult).filter((post) => {
    return !post.frontmatter.draft
  }).map((post) => {
    const pubDate = dayjs(post.frontmatter.date).utc()
    const pubYear = pubDate.year().toString()
    const pubMonth = (pubDate.month() + 1).toString().padStart(2, '0')
    const pubDay = pubDate.date().toString().padStart(2, '0')
    // filenames
    const fileParts = post.file.split('/')
    const slug = fileParts[fileParts.length - 1].split('.')[0]
    // url
    const url = genPostUrl({ pubYear, pubMonth, pubDay, slug })

    return {
      ...post,
      url,
      fullUrl: urlForPath(url),
      frontmatter: {
        ...post.frontmatter,
        pubDate,
        pubYear,
        pubMonth,
        pubDay,
        slug,
        mainImage: urlForPath(post.frontmatter.main_image)
      }
    }
  }).sort((a, b) => (
    b.frontmatter.pubDate.valueOf() - a.frontmatter.pubDate.valueOf()
  ))
}

export const getLimitedPosts = (limit = 50) => (
  getPosts().slice(0, limit)
)

export const rssSettings = ({ latestPost = null, endpoint = '/rss.xml' } = {}) => {
  const nowIsoDate = dayjs().format(RFC822_DATE_FORMAT)
  const lastPubDate = latestPost ? (
    latestPost?.frontmatter?.pubDate?.format(RFC822_DATE_FORMAT) || nowIsoDate
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
      `<lastBuildDate>${nowIsoDate}</lastBuildDate>`,
      '<ttl>1440</ttl>',
      // link
      `<atom:link href="${urlForPath(endpoint)}" rel="self" type="application/rss+xml"/>`,
      // itunes
      `<itunes:author>${DEFAULT_AUTHOR}</itunes:author>`,
      `<itunes:keywords>${DEFAULT_KEYWORDS}</itunes:keywords>`,
      `<itunes:image href="${urlForPath('/images/logo.png')}"/>`,
      '<itunes:owner>',
      `<itunes:name>${DEFAULT_AUTHOR}</itunes:name>`,
      `<itunes:email>${CONTACT_EMAIL}</itunes:email>`,
      '</itunes:owner>',
      '<itunes:block>no</itunes:block>',
      '<itunes:explicit>no</itunes:explicit>',
      '<itunes:category text="Technology"/>',
      // media
      '<media:copyright url="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International</media:copyright>',
      `<media:thumbnail url="${urlForPath('/images/logo.png')}"/>`,
      `<media:keywords>${DEFAULT_KEYWORDS}</media:keywords>`,
      '<media:category scheme="http://www.itunes.com/dtds/podcast-1.0.dtd">Technology</media:category>',
      // google
      `<googleplay:author>${DEFAULT_AUTHOR}</googleplay:author>`,
      `<googleplay:owner>${CONTACT_EMAIL}</googleplay:owner>`,
      `<googleplay:image href="${urlForPath('/images/logo.png')}"/>`,
      '<googleplay:block>no</googleplay:block>',
      '<googleplay:explicit>no</googleplay:explicit>',
      '<googleplay:category text="Technology"/>',
      // creative common
      '<creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>'
    ].join('')
  }
}

export const rssItem = ({ audioType = 'mp3' } = {}) => (post) => ({
  link: post.url,
  title: post.frontmatter.title,
  description: post.compiledContent(),
  pubDate: post.frontmatter.pubDate.toDate(),
  customData: [
    `<guid isPermaLink="true">${post.fullUrl}</guid>`,
    `<enclosure url="${post.frontmatter.audio_url}" length="${post.frontmatter.audio_size}" type="audio/mpeg"/>`,
    `<media:content url="${post.frontmatter.audio_url}" fileSize="${post.frontmatter.audio_size}" type="audio/mpeg"/>`,
    `<itunes:subtitle><![CDATA[${_truncate(post.frontmatter.summaryText, { length: 150, omission: '...' })}]]></itunes:subtitle>`,
    `<itunes:summary><![CDATA[${post.frontmatter.summaryText}]]></itunes:summary>`,
    `<itunes:image href="${post.frontmatter.mainImage}"/>`,
    `<itunes:duration>${post.frontmatter.duration}</itunes:duration>`,
    '<itunes:explicit>no</itunes:explicit>',
    `<googleplay:description><![CDATA[${post.compiledContent()}]]></googleplay:description>`,
    `<googleplay:image href="${post.frontmatter.mainImage}"/>`,
    '<googleplay:explicit>no</googleplay:explicit>'
  ].join('')
})
