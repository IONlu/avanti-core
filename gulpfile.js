const gulp  = require('gulp');
const babel = require('gulp-babel');

gulp.task('scripts', () =>
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
);

gulp.task('templates', () =>
    gulp.src('src/**/*.hbs')
        .pipe(gulp.dest('dist'))
);

gulp.task('build', ['scripts', 'templates']);

gulp.task('watch', () =>
    gulp.watch('src/**/*.js', ['build'])
);

gulp.task('default', ['build', 'watch']);
