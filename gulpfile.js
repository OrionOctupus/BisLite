let gulp = require('gulp');
let sass = require('gulp-sass');
let gulpIf = require('gulp-if');
let concat = require('gulp-concat');
let cleanCss = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();

var config = {
    paths: {
        scss: './src/scss/**/*.scss',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './public'
    },
    isDevelop: true
};

gulp.task('scss', function(done){
         gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());

        done();
})

gulp.task('serve', function (done) {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });

    gulp.watch(config.paths.scss, gulp.series('scss'));
    gulp.watch(config.paths.html).on('change', () =>{
        browserSync.reload();
        done();
    });

    done();
});


gulp.task('default', gulp.series('scss', 'serve'));