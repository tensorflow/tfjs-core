const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
const runSequence = require('run-sequence');
const del = require('del');
const p = require('./package.json');

const config = {
  src: "./src",
  pkgname: p.name,
  filename: p.name + ".js",
  dst: "./dist"
};

function getBrowserify(tinyify) {
  const b = browserify({
    entries: config.src + '/index.ts',
    standalone: config.pkgname
  }).plugin('tsify');

  return tinyify === true ? b.plugin('tinyify').bundle() : b.bundle();
}

// Clean the output folder
gulp.task('clean', () => del([config.dst]));

// Bundle the project for the browser
gulp.task('browserify', () => {
  return getBrowserify()
    .pipe(source(config.filename))
    .pipe(gulp.dest(config.dst));
});

// Bundle the project and tinify (flatPack, treeShake) it for the browser
gulp.task('tinyify', () => {
  return getBrowserify(true)
    .pipe(source(config.filename))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dst));
});

// Build step: build JS, tiny JS and TS declaration in parallel
gulp.task('build', (cb) => {
  return runSequence('clean', ['browserify', 'tinyify'], cb);
});

// default task
gulp.task('default', ['browserify']);