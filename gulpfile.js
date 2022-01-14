const gulp  = require('gulp');
const babel = require('gulp-babel');

gulp.task('scripts', () =>
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
);

gulp.task('static', () =>
    gulp.src('src/**/*.@(hbs|sh)')
        .pipe(gulp.dest('dist'))
);

gulp.task('build', gulp.parallel('scripts', 'static'));

gulp.task('watch', () =>
    gulp.watch('src/**/*.js',  gulp.series('build'))
);

gulp.task('default', gulp.series('build', 'watch'));
