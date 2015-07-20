var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var opn = require('opn');

var cssPath = [
    './assets/css/**/*'
];

var jsPath = [
    './assets/js/*.js'
];

gulp.task('css', function() {
    gulp.src(cssPath)
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
    gulp.src(jsPath)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('build', function() {
    gulp.start(['css', 'js']);
});

gulp.task('serve', function() {
    return nodemon({
        script: './bin/www',
        ext: 'js',
        env: {
            'NODE_ENV': 'development'
        },
        watch: ['app.js', './routes', './bin']
    });
});

gulp.task('livereload', function() {
    livereload.listen();
    gulp.watch('**/*.scss', function(event) {  
        gulp.run('css');
        livereload.reload();
    });
    gulp.watch(['**/*.jade', '**/*.js'], function(event) {  
        livereload.reload();
    });
});

gulp.task('openbrowser', function() {
    opn('http://localhost:3000');
});

gulp.task('default', function() {
    gulp.start('serve');
    gulp.start('livereload');
    gulp.start('openbrowser');
});
