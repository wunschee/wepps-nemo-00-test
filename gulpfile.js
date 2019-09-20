var gulp = require('gulp');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var ui5preload = require('gulp-ui5-preload');

gulp.task('clean', function(){
    return gulp.src([
        './client/app/Component-preload.js'
    ], { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task('preload', function() {
    return gulp.src([
        './client/app/**/**.+(js|xml)',
        '!./client/app/resources/**'
    ])
    .pipe(gulpif('**/*.js', uglify()))    //only pass .js files to uglify
    .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' }))) // only pass .xml to prettydata
    .pipe(ui5preload({ base: './client/app/', namespace: 'pte.grund' }))
    .pipe(gulp.dest('./client/app/'));
});

gulp.task('default', gulp.series('clean', 'preload'));