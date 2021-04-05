const fs = require('fs')
const gulp = require('gulp')
const minimist = require('minimist')
const marked = require('marked')
const htmlToText = require('html-to-text')
const matter = require('gray-matter')
const NodeID3 = require('node-id3')

const knownOptions = {
  string: 'env',
  default: {env: process.env.NODE_ENV || 'production'}
}

const options = minimist(process.argv.slice(2), knownOptions)

/**
 * Run in terminal
 * ./node_modules/.bin/gulp get_tags --md source/posts/2020/01-13-podcast-08-01.html.md
 *
 */

gulp.task('get_tags', (cb) => {
  const podcast = matter(fs.readFileSync(options.md, 'utf8'))
  const description = htmlToText.htmlToText(marked(podcast.content), {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true
  }).replace('READMORE', '')

  /* eslint-disable no-console */
  console.log('Title:')
  console.log(podcast.data.title)
  console.log('')
  console.log('Artist:')
  console.log('Алексей Васильев')
  console.log('')
  console.log('Album:')
  console.log('RWpod - подкаст про мир Ruby и Web технологии')
  console.log('')
  console.log('Comment:')
  console.log(description)
  console.log('')
  console.log('Genre:')
  console.log('Podcast')
  console.log('')
  /* eslint-enable no-console */

  return cb()
})

/**
 * Run in terminal
 * ./node_modules/.bin/gulp mp3_tags --audio /Users/leo/Stuff/podcasts/08/0801/0801.mp3 --md source/posts/2020/01-13-podcast-08-01.html.md --number 0801
 *
 */
gulp.task('mp3_tags', (cb) => {
  const podcast = matter(fs.readFileSync(options.md, 'utf8'))
  const description = htmlToText.htmlToText(marked(podcast.content), {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true
  }).replace('READMORE', '')

  const tags = {
    title: podcast.data.title,
    artist: 'Алексей Васильев',
    album: 'RWpod - подкаст про мир Ruby и Web технологии',
    comment: {
      language: 'eng',
      shortText: '',
      text: description
    },
    genre: 'Podcast',
    APIC: '/Users/leo/Stuff/podcasts/favicon_base_1024.png',
    TRCK: options.number
  }

  NodeID3.update(tags, options.audio)
  return cb()
})
