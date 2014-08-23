var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('browserify', function() {
    gulp.src('static/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./static/js/build/'));
});
