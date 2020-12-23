const gulp = require('gulp')
const del = require('del')
const critical = require('critical').stream

require('./gulp/idv3')

const criticalOptions = {
  base: 'build/',
  inline: true,
  minify: true,
  width: 1440,
  height: 1024,
  ignore: [/footer-audio-player/] // ignore footer player
}

gulp.task('cleanup:assets', () => {
  return del([
    '.tmp/dist/**/*'
  ])
})

// Generate & Inline Critical-path CSS
gulp.task('critical:index', () => {
  return gulp
    .src(['build/*.html', '!build/404.html'])
    .pipe(critical(criticalOptions))
    .on('error', (err) => {
      console.error(err.message)
    })
    .pipe(gulp.dest('build'))
})

// Generate & Inline Critical-path CSS
gulp.task('critical:this_year', () => {
  const currentYear = (new Date()).getFullYear()
  return gulp
    .src([`build/posts/${currentYear}/**/*.html`])
    .pipe(critical(criticalOptions))
    .on('error', function (err) {
      console.error(err.message)
    })
    .pipe(gulp.dest(`build/posts/${currentYear}`))
})

gulp.task('critical', gulp.parallel('critical:index', 'critical:this_year'))
