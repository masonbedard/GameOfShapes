var gulp = require("gulp");
var source  = require("vinyl-source-stream");
var browserify = require("browserify");
var watchify = require("watchify");
var hbsfy = require("hbsfy");

var browserifyMetadata = "./src/js/app.js";
var destFile = "app.js";
var destDir = "./public/";

var rebundle = function(bundler) {
    return bundler.bundle()
           .pipe(source(destFile))
           .pipe(gulp.dest(destDir));
};

gulp.task("default", ["browserify"]);
gulp.task("watch", ["watchify"]);

gulp.task("browserify", function() {
    var bundler = browserify(browserifyMetadata);
    bundler = bundler.transform(hbsfy);
    return rebundle(bundler);
});

gulp.task("watchify", function() {
    var bundler = watchify(browserifyMetadata);
    bundler = bundler.transform(hbsfy);
    bundler.on("update", function(){
        rebundle(bundler);
    });
    return rebundle(bundler);
});
