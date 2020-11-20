const gulp = require("gulp")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const rename = require('gulp-rename')
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const uglifycss = require('gulp-uglifycss')
const sourcemaps = require("gulp-sourcemaps")

const paths = {
  styles: {
    watch: "./src/webapp/scss/**/*.scss",
    entry: "./src/webapp/scss/root.scss",
    dest: "./dist/public/styles"
  }
}
function watch(src, buildFn) {
  buildFn()
  gulp.watch(src, buildFn)
}

function build(entry, destination) {
  return gulp
    .src(entry)
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(rename({
      suffix: '.min',
      basename: 'main'
    }))
    .pipe(gulp.dest(destination))
}

function buildWebAppStyles() {
  return build(paths.styles.entry, paths.styles.dest)
}

	
function watchWebAppStyles() {
  watch(paths.styles.watch, buildWebAppStyles)
}

exports.build = buildWebAppStyles

exports.watch = watchWebAppStyles
