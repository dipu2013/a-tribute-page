'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var gutil        = require('gulp-util');
var jshint       = require('gulp-jshint');
var clean        = require('gulp-clean');
var csso         = require('gulp-csso');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var stylish      = require('jshint-stylish');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var imagemin     = require('gulp-imagemin');
var fileinclude  = require('gulp-file-include');
var inject       = require('gulp-inject-string');
var autoprefixer = require('gulp-autoprefixer');
var gulpif       = require('gulp-if');
var argv         = require('minimist')(process.argv.slice(2));
var browserSync  = require('browser-sync').create();

var path         = {
    html         : 'src/*.html',
    htminc       : 'src/_inc/**/*.htm',
    incdir       : 'src/_inc/',
    libs      : 'src/assets/libs/**/*.*',
    js           : 'src/assets/js/*.*',
    scss         : 'src/assets/scss/**/*.scss',
    img          : 'src/assets/img/**/*.+(png|jpg|gif)',
    options      : 'src/assets/options/**/*.*'
};

var destination  = (argv.demo) ? 'build/demo/' : (argv.pub) ? 'build/publish/' : 'build/development/';

var assets       = destination + 'assets/';

var sourcemap    = (argv.demo) ? false : (argv.pub) ? false : true;

var port         = (argv.demo) ? 8002 : (argv.pub) ? 8003 : 8001;


/* =====================================================
    CLEAN
    ===================================================== */

gulp.task('clean', function() {
  return gulp.src(destination, {read: false})
  .pipe(clean());
});


/* =====================================================
    HTML
    ===================================================== */

var html = function() {
  return gulp.src( path.html )
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({ basepath: path.incdir }))
    // Inject theme option for TO and DEMO
    .pipe(gulpif(argv.to || argv.demo, inject.before('</body', '<link href="assets/options/optionswitch.css" rel="stylesheet">\n')))
    .pipe(gulpif(argv.to || argv.demo, inject.before('</body', '<script src="assets/options/optionswitcher.js"></script>\n')))
    .pipe(gulp.dest(destination))
    .pipe(browserSync.reload({
      stream: true
    }));
};

gulp.task('html', ['clean'], html);
gulp.task('html-watch', html);


/* =====================================================
    SCSS
    ===================================================== */

var scss = function() {
  var ignoreNotification = false;
  return gulp.src( path.scss )
    .pipe(customPlumber('Error Running Sass'))
    // sourcemaps for Development
    .pipe(gulpif(sourcemap, sourcemaps.init()))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(argv.demo, csso({
        restructure: false,
        sourceMap: true,
        debug: true
    })))
    .pipe(gulpif(sourcemap, sourcemaps.write('.')))
    .pipe(gulp.dest(assets + 'css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

gulp.task('scss', ['clean'], scss);
gulp.task('scss-watch', scss);


/* =====================================================
    JS
    ===================================================== */

var js = function() {
  return gulp.src( path.js )
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(gulpif(argv.demo, uglify()))
    .pipe(gulp.dest(assets + 'js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

gulp.task('js', ['clean'], js);
gulp.task('js-watch', js);


/* =====================================================
    IMAGE
    ===================================================== */

var image = function() {
  return gulp.src( path.img )
    .pipe(gulpif(argv.demo || argv.pub , imagemin({ progressive: true })))
    .pipe(gulp.dest(assets + 'img/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

gulp.task('img', ['clean'], image);
gulp.task('img-watch', image);


/* =====================================================
    libs
    ===================================================== */

var libs = function() {
  return gulp.src( path.libs )
    .pipe(gulp.dest(assets + 'libs/'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

gulp.task('libs', ['clean'], libs);
gulp.task('libs-watch', libs);


/* =====================================================
    OPTIONS
    ===================================================== */

var options = function() {
  return gulp.src( path.options )
    .pipe(gulpif(argv.to || argv.demo , gulp.dest(assets + 'options/')))
    .pipe(gulpif(argv.to || argv.demo, browserSync.reload({
      stream: true
    })));
};

gulp.task('options', ['clean'], options);
gulp.task('options-watch', options);


/* =====================================================
    ERROR MESSAGE
    ===================================================== */

function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass"
    })
  });
}


/* =====================================================
    BUILD
    ===================================================== */

gulp.task('build', [
  'html',
  'scss',
  'js',
  'img',
  'libs',
  'options'
], function() {
  browserSync.init({
    server: {
      baseDir: destination
    },
    port: port
  });
});


/* =====================================================
    WATCH
    ===================================================== */

gulp.task('watch', ['build'], function() {
  gulp.watch( path.html, ['html-watch'] );
  gulp.watch( path.htminc, ['html-watch'] );
  gulp.watch( path.scss, ['scss-watch'] );
  gulp.watch( path.js, ['js-watch'] );
  gulp.watch( path.img, ['img-watch'] );
  gulp.watch( path.options, ['options-watch'] );
});


/* =====================================================
    TASKS
    ===================================================== */

gulp.task('default', ['watch']);


/* =====================================================
    COMMANDS
    ===================================================== */

// gulp         : Development
// gulp --to    : Development with Theme Option

// gulp --demo  : Live Preview Demo
// gulp --pub   : Publishable
