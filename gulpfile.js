const gulp = require('gulp')
const del = require('del')
const purgecss = require('gulp-purgecss')
const gzip = require('gulp-gzip')
const critical = require('critical').stream

require('./gulp/tags')

const criticalOptions = {
  base: 'build/',
  inline: true,
  minify: true,
  width: 1440,
  height: 1024
}

// Assetts cleanup
gulp.task('cleanup:assets', () => {
  return del([
    '.tmp/dist/**/*'
  ])
})

// Purgecss for app.css
gulp.task('purgecss:app_css', () => {
  return gulp.src('build/app-*.css')
    .pipe(purgecss({
      content: ['build/**/*.html']
    }))
    .pipe(gulp.dest('build'))
})

// Gzip app.css after purgecss
gulp.task('purgecss:recompress_app_css', () => {
  return gulp.src('build/app-*.css')
    .pipe(gzip({
      append: true,
      threshold: '10kb',
      gzipOptions: {level: 9, memLevel: 8},
      skipGrowingFiles: true
    }))
    .pipe(gulp.dest('build'))
})

// Generate & Inline Critical-path CSS
gulp.task('critical:index', () => {
  return gulp
    .src(['build/*.html', '!build/404.html'])
    .pipe(critical(criticalOptions))
    .on('error', (err) => {
      // eslint-disable-next-line no-console
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
    .on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message)
    })
    .pipe(gulp.dest(`build/posts/${currentYear}`))
})

gulp.task('purgecss', gulp.series('purgecss:app_css', 'purgecss:recompress_app_css'))
gulp.task('critical', gulp.parallel('critical:index', 'critical:this_year'))
gulp.task('optimize', gulp.series('purgecss', 'critical'))
