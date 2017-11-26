var gulp = require('gulp');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');

gulp.task('build', function () {
    var postcss = require('gulp-postcss');
    var customProperties = require('postcss-custom-properties');
    var nested = require('postcss-nested');
    var preprocessors = [
        customProperties, nested
    ];
    return gulp.src('./css/index.css')
        .pipe(postcss(preprocessors))
        .pipe(gulp.dest('./dist'));
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./dist/", //対象ディレクトリ
            index: "index.html" //インデックスファイル
        }
    });
});
gulp.task('default', ['browser-sync'], function () {
    gulp.watch("./src/**", ['pug', 'copy', 'bs-reload']);
});
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});
gulp.task('copy', function () {
    gulp.src(['./node_modules/riot/riot.min.js',
            "./node_modules/riot/riot+compiler.min.js",
            "./node_modules/riot-route/dist/route.min.js",
            "assets/**"
        ])
        .pipe(gulp.dest('./dist/assets/'));

    gulp.src(['./src/js/*.js'])
        .pipe(gulp.dest('./dist/js/'));
});

//pugをhtmlに変換
gulp.task("pug", () => {
    var pug = require("gulp-pug");
    var option = {
        pretty: true
    }
    gulp.src("./src/index.pug")
        .pipe(pug(option))
        .pipe(gulp.dest("./dist/"));
    gulp.src("./src/pugs/*.pug")
        .pipe(pug(option))
        .pipe(rename({
            extname: '.tag'
        }))
        .pipe(gulp.dest("./dist/tags/"));
});