const fs = require('fs')
const gulp = require('gulp')
const minimist = require('minimist')
const { marked } = require('marked')
const htmlToText = require('html-to-text')
const matter = require('gray-matter')

const knownOptions = {
  string: 'env',
  default: {env: process.env.NODE_ENV || 'production'}
}

const options = minimist(process.argv.slice(2), knownOptions)

/**
 * Run in terminal
 * ./node_modules/.bin/gulp get_tags --md source/posts/2020/01-13-podcast-08-01.html.md --cue /Users/leo/Stuff/podcasts/08/0801/0108.cue
 *
 */

gulp.task('get_tags', (cb) => {
  const podcast = matter(fs.readFileSync(options.md, 'utf8'))
  const description = htmlToText.htmlToText(marked(podcast.content), {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true
  })

  const cueFileContent = `
TITLE "RWpod - подкаст про Ruby та Web технології"
FILE "1.m4a" BINARY
  TRACK 01 AUDIO
    GENRE "Podcast"
    PERFORMER "Олексій Васильєв"
    TITLE "${podcast.data.title}"
    INDEX 01 00:00:00
`
  fs.writeFileSync(options.cue, cueFileContent)

  /* eslint-disable no-console */
  console.log('Comment:')
  console.log(description)
  /* eslint-enable no-console */

  return cb()
})
