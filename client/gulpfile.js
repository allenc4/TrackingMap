const {src, dest, watch, series} = require('gulp');

const sass = require('gulp-sass');
const wait = require('gulp-wait');

function runStyles() {
    return src('./scss/*.scss')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest('src/css'));
}

function watchFiles(cb) {
    watch('./scss/*.scss', runStyles);
}
exports.runStyles = runStyles;
exports.watch = watchFiles;

exports.default = series(runStyles);