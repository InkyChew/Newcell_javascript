var gulp = require('gulp');
var pug = require('gulp-pug'); // 編譯pug
var sass = require('gulp-sass'); // 編譯scss
var prefix = require('gulp-autoprefixer'); // scss編譯後，補前綴字
var babel = require('gulp-babel'); // babel轉譯js
var browserSync = require('browser-sync'); // 瀏覽器自動刷新用
var plumber = require('gulp-plumber'); // 避免套件出錯就終止任務監聽

var isCompleted = 0;

var paths = {
  pug: {
    src: './src/pug/*.pug',
    dist: './dist',
    watch: 'src/pug/*.pug'
  },
  scss: {
    src: './src/scss/*.sass',
    dist: './dist/style',
    watch: 'src/scss/*.sass'
  },
  js: {
    src: './src/js/*.js',
    dist: './dist/js',
    watch: 'src/js/*.js'
  },
  browserSync: {
    baseDir: './dist',
    port: 3001
  }
}

var options = {
  sass: {
    outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
  },
  prefix: {
    browsers: ['last 2 versions']
  }
}

/**
 * Pug Task
 */
gulp.task('pug', function () {
  return gulp.src(paths.pug.src)
    .pipe(plumber())
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest(paths.pug.dist))
    .on('task_stop', function () {
      isCompleted++
    });
});

/**
 * SCSS Task
 */
gulp.task('scss', function () {
  return gulp.src(paths.scss.src) // 來源檔案
    .pipe(plumber())
    .pipe(sass(options.sass)) // 將sass編譯成css
    .pipe(prefix(options.prefix)) // prefix()加入前綴，()內不加屬性則使用autoprefix的預設值
    .pipe(gulp.dest(paths.scss.dist)) // 要輸出的檔案位子
    .on('task_stop', function () {
      isCompleted++
    });
});

/**
 * Babel Task
 */
gulp.task('js', function () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.js.dist))
    case 'production':
      return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(gulp.dest(paths.js.dist))
        .on('task_stop', function () {
          isCompleted++
        });
  }
})

/**
 * browser-sync Task
 */
gulp.task('browser-sync', function () {
  browserSync.init(['./src/style/*.css', './src/js/*.js'], {
    server: {
      baseDir: paths.browserSync.baseDir
    },
    port: paths.browserSync.port
  });
});

/**
 * Watch Task
 */
gulp.task('watch', function () {
  gulp.watch(paths.pug.watch, ['pug']).on('change', browserSync.reload);
  gulp.watch(paths.scss.watch, ['scss']).on('change', browserSync.reload);
  gulp.watch(paths.js.watch, ['js']).on('change', browserSync.reload);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('complete', function () {
  if (isCompleted === 3) {
    process.exit();
  }
})

/**
 * Default Task
 */
// gulp.task('default', ['watch', 'pug', 'scss', 'js', 'browser-sync']); // 執行gulp時一併執行watch、sass、browser-sync的指令

switch (process.env.NODE_ENV) {
  case 'development':
    gulp.task('default', ['watch', 'pug', 'scss', 'js', 'browser-sync']);
    break
  case 'production':
    gulp.task('default', ['pug', 'scss', 'js', 'complete']);
    break
}
