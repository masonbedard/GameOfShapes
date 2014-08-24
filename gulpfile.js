var gulp = require("gulp");
var source  = require("vinyl-source-stream");
var browserify = require("browserify");
var hbsfy = require("hbsfy");

gulp.task("default", ["browserify"]);

gulp.task("browserify", function() {
    return browserify("./src/js/index.js")
           .transform(hbsfy)
           .bundle()
           .pipe(source("app.js"))
           .pipe(gulp.dest("./public/"));
});

