'use strict'

import gulp from 'gulp'
import del from 'del'
import runSequence from 'run-sequence'
import gulpLoadPlugins from 'gulp-load-plugins'
import { spawn } from "child_process"
import tildeImporter from 'node-sass-tilde-importer'

const $ = gulpLoadPlugins()
const browserSync = require('browser-sync').create()
const isProduction = process.env.NODE_ENV === 'production'
const imageResize = require('gulp-image-resize');

const onError = (err) => {
    console.log(err)
}

// --

gulp.task('server', ['build'], () => {
    gulp.start('init-watch')
    $.watch(['archetypes/**/*', 'data/**/*', 'content/**/*', 'layouts/**/*', 'static/**/*', 'config.toml'], () => gulp.start('hugo'))
});

gulp.task('server:with-drafts', ['build-preview'], () => {
    gulp.start('init-watch')
    $.watch(['archetypes/**/*', 'data/**/*', 'content/**/*', 'layouts/**/*', 'static/**/*', 'config.toml'], () => gulp.start('hugo-preview'))
});

gulp.task('init-watch', () => {
    browserSync.init({
        server: {
            baseDir: 'public'
        },
        open: false
    })
    $.watch('src/sass/**/*.scss', () => gulp.start('sass'))
    $.watch('src/js/**/*.js', () => gulp.start('js-watch'))
    $.watch('src/images/**/*', () => gulp.start('images'))
    $.watch('src/images/**/*', () => gulp.start('images-resize-small'))
    $.watch('src/images/**/*', () => gulp.start('images-resize-medium'))
   
})

gulp.task('build', () => {
    runSequence(['sass', 'js', 'fonts', 'images', 'images-resize-small', 'images-resize-medium', 'videos', 'pub-delete'], 'hugo')
})

gulp.task('build-preview', () => {
    runSequence(['sass', 'js', 'fonts', 'images', 'images-resize-small', 'images-resize-medium', 'videos', 'pub-delete'], 'hugo-preview')
})

gulp.task('hugo', (cb) => {
    return spawn('hugo', ['--buildFuture'], { stdio: 'inherit' }).on('close', (code) => {
        browserSync.reload()
        cb()
    })
})

gulp.task('hugo-preview', (cb) => {
    return spawn('hugo', ['--buildDrafts', '--buildFuture'], { stdio: 'inherit' }).on('close', (code) => {
        browserSync.reload()
        cb()
    })
})

// --

gulp.task('sass', () => {
    return gulp.src([
        'src/sass/app.scss'
    ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sass({ precision: 5, importer: tildeImporter }))
    .pipe($.autoprefixer(['ie >= 10', 'last 2 versions']))
    .pipe($.if(isProduction, $.cssnano({ discardUnused: false, minifyFontValues: false })))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/css'))
    .pipe(browserSync.stream())
})

gulp.task('js-watch', ['js'], (cb) => {
    browserSync.reload();
    cb();
});

gulp.task('js', () => {
    return gulp.src([
        'src/js/**/*.js'
    ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.babel())
    //.pipe($.concat('app.js'))
    .pipe($.if(isProduction, $.uglify()))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/js'))
})

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*.{woff,woff2}')
        .pipe(gulp.dest('static/fonts'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*.{png,jpg,jpeg,gif,svg,webp,ico}')
        .pipe($.newer('static/images'))
        .pipe($.print())
        .pipe($.imagemin())
        .pipe(gulp.dest('static/images'));
});
gulp.task('images-resize-small', () => {
  return gulp.src('static/images/**/*.{png,jpg,jpeg}')
    .pipe($.newer('static/images-resized/small/images'))
    .pipe($.print())
    .pipe($.imageResize({
      width : 500,
      upscale : false
    }))
    .pipe(gulp.dest('static/images-resized/small/images'));
});
gulp.task('images-resize-medium', () => {
  return gulp.src('static/images/**/*.{png,jpg,jpeg}')
    .pipe($.newer('static/images-resized/medium/images'))
    .pipe($.print())
    .pipe($.imageResize({
      width : 1000,
      upscale : false
    }))
    .pipe(gulp.dest('static/images-resized/medium/images'));
});
gulp.task('cms-delete', () => {
    return del(['static/admin'], { dot: true })
})

gulp.task('pub-delete', () => {
    return del(['public/**', '!public'], {
      // dryRun: true,
      dot: true
    }).then(paths => {
      console.log('Files and folders deleted:\n', paths.join('\n'), '\nTotal Files Deleted: ' + paths.length + '\n');
    })
})