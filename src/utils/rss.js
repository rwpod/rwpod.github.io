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

const durationToSeconds = (duration) => {
  if (!duration) {
    return 0
  }

  const [hours, minutes, seconds] = duration.split(':').map((i) => parseInt(i.trim(), 10))
  return hours * 3600 + minutes * 60 + seconds
}

export const rssSettings = ({ latestPost = null, endpoint = '/rss.xml' } = {}) => {
  const nowDate = dayjs().format(RFC822_DATE_FORMAT)
  const lastPubDate = latestPost
    ? latestPost?.data?.pubDate?.format(RFC822_DATE_FORMAT) || nowDate
    : nowDate

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: import.meta.env.SITE,
    stylesheet: '/rss/styles.xsl',
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      media: 'http://search.yahoo.com/mrss/',
      podcast: 'https://podcastindex.org/namespace/1.0',
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
      '<podcast:updateFrequency rrule="FREQ=WEEKLY">Weekly</podcast:updateFrequency>',
      '<podcast:funding url="https://www.buymeacoffee.com/leopard">Support the show!</podcast:funding>',
      // image
      '<image>',
      `<url>${urlForPath('/images/logo.png')}</url>`,
      `<title>${DEFAULT_TITLE}</title>`,
      `<link>${import.meta.env.SITE}</link>`,
      '</image>',
      // link
      `<atom:link href="${urlForPath(endpoint)}" rel="self" type="application/rss+xml" />`,
      `<atom:link href="${import.meta.env.SITE}" rel="hub" xmlns="http://www.w3.org/2005/Atom" />`,
      // itunes
      `<itunes:author>${DEFAULT_AUTHOR}</itunes:author>`,
      `<itunes:keywords>${DEFAULT_KEYWORDS}</itunes:keywords>`,
      `<itunes:image href="${urlForPath('/images/logo.png')}" />`,
      '<itunes:owner>',
      `<itunes:name>${DEFAULT_AUTHOR}</itunes:name>`,
      `<itunes:email>${CONTACT_EMAIL}</itunes:email>`,
      '</itunes:owner>',
      '<itunes:block>no</itunes:block>',
      '<itunes:explicit>false</itunes:explicit>',
      '<itunes:category text="Technology" />',
      // media
      '<media:copyright url="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International</media:copyright>',
      `<media:thumbnail url="${urlForPath('/images/logo.png')}" />`,
      `<media:keywords>${DEFAULT_KEYWORDS}</media:keywords>`,
      '<media:category scheme="http://www.itunes.com/dtds/podcast-1.0.dtd">Technology</media:category>',
      // license
      '<podcast:license url="http://creativecommons.org/licenses/by-nc-nd/4.0/">cc-by-nc-nd-4.0</podcast:license>',
      // creative common
      '<creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/4.0/</creativeCommons:license>'
    ].join('')
  }
}

export const rssItem =
  ({ audioType = 'mp3' } = {}) =>
  (post) => ({
    link: post.url,
    title: post.data.title,
    description: post.htmlContent,
    pubDate: post.data.pubDate.toDate(),
    customData: [
      // audio file
      audioType === 'mp3' &&
        `<enclosure url="${post.data.audio_url}" length="${post.data.audio_size}" type="audio/mpeg" />`,
      audioType === 'mp3' &&
        `<media:content url="${post.data.audio_url}" fileSize="${post.data.audio_size}" type="audio/mpeg" />`,
      audioType === 'aac' &&
        `<enclosure url="${post.data.audio_aac_url}" length="${post.data.audio_aac_size}" type="audio/m4a" />`,
      audioType === 'aac' &&
        `<media:content url="${post.data.audio_aac_url}" fileSize="${post.data.audio_aac_size}" type="audio/m4a" />`,
      // transcript
      post.data.transcript &&
        post.data.transcript.srt &&
        `<podcast:transcript url="${post.data.transcript.srt}" type="application/srt" />`,
      post.data.transcript &&
        post.data.transcript.json &&
        `<podcast:transcript url="${post.data.transcript.json}" type="application/json" />`,
      post.data.transcript &&
        post.data.transcript.html &&
        `<podcast:transcript url="${post.data.transcript.html}" type="text/html" />`,
      // itunes
      `<itunes:subtitle><![CDATA[${_truncate(post.textContent, {
        length: 150,
        omission: '...'
      })}]]></itunes:subtitle>`,
      `<itunes:summary><![CDATA[${post.textContent}]]></itunes:summary>`,
      `<itunes:duration>${durationToSeconds(post.data.duration)}</itunes:duration>`,
      `<itunes:image href="${post.data.coverWithDomain}" />`,
      '<itunes:explicit>false</itunes:explicit>'
    ]
      .filter(Boolean)
      .join('')
  })
