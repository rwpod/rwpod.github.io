import dayjs from '@utils/dayjs'
import _truncate from 'lodash/truncate'
import { urlForPath } from '@utils/links'
import {
  DEFAULT_TITLE,
  DEFAULT_KEYWORDS,
  DEFAULT_DESCRIPTION,
  DEFAULT_AUTHOR,
  DEFAULT_COPYRIGHT,
  CONTACT_EMAIL
} from '@utils/content'

const RFC822_DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

export const rssSettings = ({ latestPost = null, endpoint = '/rss.xml' } = {}) => {
  const nowDate = dayjs().format(RFC822_DATE_FORMAT)
  const lastPubDate = latestPost
    ? latestPost?.frontmatter?.pubDate?.format(RFC822_DATE_FORMAT) || nowDate
    : nowDate

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: import.meta.env.SITE,
    stylesheet: '/rss/styles.xsl',
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      media: 'http://search.yahoo.com/mrss/',
      creativeCommons: 'http://backend.userland.com/creativeCommonsRssModule',
      atom: 'http://www.w3.org/2005/Atom',
      content: 'http://purl.org/rss/1.0/modules/content/'
    },
    customData: [
      '<language>en-us</language>',
      `<copyright>${DEFAULT_COPYRIGHT}</copyright>`,
      `<pubDate>${lastPubDate}</pubDate>`,
      `<lastBuildDate>${nowDate}</lastBuildDate>`,
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
      // creative common
      '<creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>'
    ].join('')
  }
}

export const rssItem =
  ({ audioType = 'mp3' } = {}) =>
  (post) => ({
    link: post.url,
    title: post.frontmatter.title,
    description: post.compiledContent(),
    pubDate: post.frontmatter.pubDate.toDate(),
    customData: [
      // audio file
      audioType === 'mp3' &&
        `<enclosure url="${post.frontmatter.audio_url}" length="${post.frontmatter.audio_size}" type="audio/mpeg"/>`,
      audioType === 'mp3' &&
        `<media:content url="${post.frontmatter.audio_url}" fileSize="${post.frontmatter.audio_size}" type="audio/mpeg"/>`,
      audioType === 'aac' &&
        `<enclosure url="${post.frontmatter.audio_aac_url}" length="${post.frontmatter.audio_aac_size}" type="audio/m4a"/>`,
      audioType === 'aac' &&
        `<media:content url="${post.frontmatter.audio_aac_url}" fileSize="${post.frontmatter.audio_aac_size}" type="audio/m4a"/>`,
      // itunes
      `<itunes:subtitle><![CDATA[${_truncate(post.frontmatter.htmlAsText(), {
        length: 150,
        omission: '...'
      })}]]></itunes:subtitle>`,
      `<itunes:summary><![CDATA[${post.frontmatter.htmlAsText()}]]></itunes:summary>`,
      `<itunes:duration>${post.frontmatter.duration}</itunes:duration>`,
      `<itunes:image href="${post.frontmatter.mainImage}"/>`,
      '<itunes:explicit>no</itunes:explicit>'
    ]
      .filter(Boolean)
      .join('')
  })
