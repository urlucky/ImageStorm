var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var opn = require('opn');

var scssPath = [
    './assets/scss/*.scss'
];

var cssPath = [
    './assets/css/*.css'
];

var jsPath = [
    './assets/js/*.js'
];

gulp.task('sass', function () {
    gulp.src(scssPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('css', function() {
    return gulp.src(cssPath)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
    gulp.src(jsPath)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('build', function() {
    gulp.start(['sass', 'css', 'js']);
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
    gulp.watch('**/*.scss', function(file) {
        gulp.run('sass');
        gulp.run('css');
        livereload.reload(file);
    });
    gulp.watch(['**/*.jade', '**/*.js'], function(file) {  
        livereload.reload(file);
    });
});

gulp.task('openbrowser', function() {
    opn('http://localhost:3000');
});

gulp.task('default', function() {
    gulp.start(['sass', 'css', 'js', 'serve', 'livereload', 'openbrowser']);
});
