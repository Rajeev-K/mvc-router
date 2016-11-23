var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    var paths = ['./Assets/*.scss'];
    return gulp.src(paths, { base: "./" })
        .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest('./'))
});

gulp.task('sass:watch', function () {
    gulp.watch('./Assets/*.scss', ['sass']);
});

gulp.task('default', ['sass'], function () {
});
