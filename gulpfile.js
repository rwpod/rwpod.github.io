var gulp = require('gulp')
var del = require('del')
var critical = require('critical').stream

var criticalOptions = {
  base: 'build/',
  inline: true,
  minify: true,
  width: 1440,
  height: 1024
}

gulp.task('cleanup:assets', function () {
  return del([
    '.tmp/dist/**/*'
  ])
})

// Generate & Inline Critical-path CSS
gulp.task('critical:index', function () {
  return gulp
    .src(['build/*.html', '!build/404.html'])
    .pipe(critical(criticalOptions))
    .on('error', function (err) {
      console.error(err.message)
    })
    .pipe(gulp.dest('build'))
})

gulp.task('critical', gulp.parallel('critical:index'))
