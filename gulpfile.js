var gulp = require('gulp')
var del = require('del')

gulp.task('cleanup:assets', function () {
  return del([
    '.tmp/dist/**/*'
  ]);
});

