// Gulp variables
var gulp = require('gulp'),
    bower = require('gulp-bower'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    notify = require("gulp-notify"),
    copy = require('gulp-copy');
// BrowserSync
var browserSync = require('browser-sync').create();
// Config directories
var config = {
    publicPath: 'www',
    devPath: 'www/dev',
    bowerDir: './bower_components'
};
// Gulp tasks
gulp.task('bower', function() {
    return bower().pipe(gulp.dest(config.bowerDir));
});
gulp.task('lib', function() {
    return gulp.src([
        config.bowerDir + '/jquery/dist/jquery.js',
        config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
        config.bowerDir + '/angular/angular.js',
        config.bowerDir + '/angular-resource/angular-resource.js',
        config.bowerDir + '/lodash/lodash.js',
        config.bowerDir + '/requirejs/require.js'
    ]).pipe(uglify()).pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.publicPath + '/js/lib/'));
});
gulp.task('js', function() {
    return gulp.src([
        config.devPath + '/js/**/*.js'
    ])
    .pipe(concat('main.min.js')).pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.publicPath + '/js/'))
    .on("error", notify.onError(function(error) {
        return "Error: " + error.message;
    }))
    .pipe(browserSync.stream());
});
gulp.task('fonts', function() {
    return gulp.src([
        config.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/*',
        config.bowerDir + '/font-awesome/fonts/**.*'
    ]).pipe(copy(config.publicPath + '/fonts', {
        prefix: 7
    }));
});
gulp.task('watch', function() {
    gulp.watch(config.devPath + '/js/**/*.js', ['js']);
});
gulp.task('serve', ['js'], function() {
    browserSync.init({
        server: config.publicPath
    });
    gulp.watch(config.devPath + '/js/**/*.js', ['js']);
    gulp.watch(config.publicPath + '/css/**/*.css').on('change', browserSync.reload);
    gulp.watch(config.publicPath + '/*.html').on('change', browserSync.reload);
});
gulp.task('default', ['bower', 'lib', 'js', 'fonts', 'serve']);