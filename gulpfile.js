'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');
var Karma = require('karma').Server;

// provide task names for dev, test, production builds
gulp.task('webpack:dev', function() {
  return gulp.src('./app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
  });

gulp.task('webpack:test', function() {
  return gulp.src('./test/client/entry.js')
  .pipe(webpack({
    output: {
      filename: 'test_bundle.js'
    }
  }))
  .pipe(gulp.dest('test/client'));
});

gulp.task('staticfiles:dev', function() {
  return gulp.src('./app/**/*.html')
  .pipe(gulp.dest('build/'));
});

gulp.task('jshint:dev', function() {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build:dev', ['jshint:dev', 'staticfiles:dev', 'webpack:dev']);

gulp.task('servertests', function() {
  return gulp.src('test/api_test/**/*_test.js', { read: false })
    .pipe(mocha({reporter: 'dot'}))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      if (1 === this.seq.length && 'servertests' === this.seq[0]) {
        process.exit();
      }
    }.bind(this));
});

gulp.task('karmatests', ['webpack:test'], function(done) {  // test dependencies
  new Karma({ configFile: __dirname + '/karma.conf.js'}, done).start();
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['build:dev']);
    gulp.watch('app/*.html', ['staticfiles:dev']);
});

gulp.task('default', ['build:dev']);
