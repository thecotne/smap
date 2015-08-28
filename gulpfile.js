var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var named = require('vinyl-named');
var rename = require('gulp-rename');
var path = require('path');
var watch = require('gulp-watch');


gulp.task('js', function () {
	return gulp.src(['src/**/**.entry.js','spec/**/**.entry.js'])
		.pipe(named())
		.pipe(gulpWebpack({
			module: {
				// noParse: [/node_modules/],
				loaders: [
					{
						test: /\.js$/,
						// exclude: /node_modules/,
						loader: 'babel-loader'
					}
				],
			}
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.entry', '.bundle');
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['js']);

gulp.task('watch', ['default'], function() {
	watch(['src/**/**.js', 'spec/**/**.js'], function() {
		gulp.start(['js']);
	});
});
