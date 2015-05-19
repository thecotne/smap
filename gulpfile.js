var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var named = require('vinyl-named');
var rename = require('gulp-rename');
var path = require('path');


gulp.task('js', function () {
	return gulp.src(['src/**/**.entry.js','spec/**/**.entry.js'])
		.pipe(named())
		.pipe(gulpWebpack({
			module: {
				noParse: [/bower_components/],
				loaders: [
					{
						test: /\.js$/,
						exclude: /node_modules|bower_components/,
						loader: 'babel-loader'
					}
				],
			},
			resolve: {
				root: [path.join(__dirname, "bower_components")]
			},
			plugins: [
				new webpack.ResolverPlugin(
					new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
				)
			]
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.entry', '.bundle');
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['js']);

gulp.task('watch', ['default'], function() {
	gulp.watch(['src/**/**.js', 'spec/**/**.js'], ['js']);
});
