var gulp = require('gulp');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var spawn = require('child_process').spawn;
var node;

gulp.task('reload', ['js'], function () {
	if (node) node.kill()
		node = spawn('node', ['index.js'], {stdio: 'inherit'});

	node.on('close', function (code) {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		}
	});
});

gulp.task('js', function() {
	gulp.src([
		'./index.js',
		'./builder.js',
		'./config.js',
		'./app/**/*.js',
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
});

gulp.task('watch', function () {
	gulp.start('reload', function() {});

	watch(['index.js', 'index.js', 'config.js', 'builder.js', 'app/**/*.js'], function (files, cb) {
		gulp.start('reload', cb);
	});
});