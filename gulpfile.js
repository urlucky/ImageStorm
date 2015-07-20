var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

var cssPath = [
    './vendor/webuploader_fex/dist/webuploader.css',
    './assets/css/**/*'
];

var jsPath = [
    './vendor/jquery/dist/jquery.js',
    './vendor/webuploader_fex/dist/webuploader.js',
    './assets/js/**/*'
];

gulp.task('css', function () {
    gulp.src(cssPath)
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    gulp.src(jsPath)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
    gulp.watch('assets/css/**/*', ['css']);
    gulp.watch('assets/js/**/*', ['js']);
});

gulp.task('build', function () {
    gulp.start(['css', 'js']);
});

gulp.task('nodemon', function () {
    nodemon({
        script: './bin/www',
        ext: 'sass js',
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('default', function () {
    gulp.start('watch');
    gulp.start('nodemon');
});
