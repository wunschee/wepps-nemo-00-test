var gulp = require('gulp');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var ui5preload = require('gulp-ui5-preload');

gulp.task('clean', function(){
    return gulp.src([
        'dist',
        './Component-preload.js'
    ], { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task('preload', function() {
    return gulp.src([
        './**/**.+(js|xml)',
        '!./node_modules/**'
    ])
    .pipe(gulpif('**/*.js', uglify()))    //only pass .js files to uglify
    .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' }))) // only pass .xml to prettydata
    .pipe(ui5preload({ base: './', namespace: 'hahu.pmtool' }))
    .pipe(gulp.dest('./'));
});

gulp.task('distribute', function() {
    return gulp.src([
        './**/**.+(js|xml|css|properties|png|pdf)',
        '!./node_modules/**',
        './**.+(js|json|html)',
        '!./gulpfile.js',
        '!./package.json'
    ], { base: './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('clean', 'preload', 'distribute'));