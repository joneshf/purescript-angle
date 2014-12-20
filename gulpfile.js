'use strict'

var gulp       = require('gulp')
  , purescript = require('gulp-purescript')
  , rename     = require('gulp-rename')
  , umd        = require('gulp-umd')
  ;

var paths =
    { src: 'src/**/*.purs'
    , bowerSrc: ['bower_components/purescript-*/src/**/*.purs']
    , dest: ''
    , docsDest: 'README.md'
    };

var options =
    { compiler:
        { modules: ['Angle']
        }
    , pscDocs: {}
    , umd:
        { exports: function(_) {return 'PS.Angle';}
        , namespace: function(_) {return 'Angle';}
        }
    };

var compile = function(compiler) {
    var psc = compiler(options.compiler);
    psc.on('error', function(e) {
        console.error(e.message);
        psc.end();
    });
    return gulp.src([paths.src].concat(paths.bowerSrc))
        .pipe(psc)
        .pipe(gulp.dest(paths.dest));
};

gulp.task('umd', ['browser'], function() {
    return gulp.src('psc.js')
        .pipe(umd(options.umd))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('bin'));
});

gulp.task('make', function() {
    return compile(purescript.pscMake);
});

gulp.task('dotPsci', function() {
  gulp.src([paths.src].concat(paths.bowerSrc))
    .pipe(purescript.dotPsci());
});

gulp.task('browser', function() {
    return compile(purescript.psc);
});

gulp.task('docs', function() {
    var pscDocs = purescript.pscDocs(options.pscDocs);
    pscDocs.on('error', function(e) {
        console.error(e.message);
        pscDocs.end();
    });
    return gulp.src(paths.src)
      .pipe(pscDocs)
      .pipe(gulp.dest(paths.docsDest));
});

gulp.task('watch-browser', function() {
    gulp.watch(paths.src, ['browser', 'docs']);
});

gulp.task('watch-make', function() {
    gulp.watch(paths.src, ['make', 'dotPsci', 'docs']);
});

gulp.task('default', ['make', 'dotPsci', 'docs']);
