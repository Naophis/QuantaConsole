var gulp = require('gulp');

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