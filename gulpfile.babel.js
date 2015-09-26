import gulp from 'gulp';
import webpack from 'gulp-webpack';
import named from 'vinyl-named';
import rename from 'gulp-rename';
import watch from 'gulp-watch';
import jsdoc from 'gulp-jsdoc';
import {resolve} from 'path';

gulp.task('jsdoc', () => {
	return gulp.src(['src/**.js'])
		.pipe(jsdoc.parser({
			plugins: [resolve('./jsdoc/plugins/commentsOnly.js')]
		}))
		.pipe(jsdoc.generator('docs'));
});

gulp.task('js', () => {
	return gulp.src(['src/**/**.entry.js','spec/**/**.entry.js'])
		.pipe(named())
		.pipe(webpack({
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
		.pipe(rename((path) => {
			path.basename = path.basename.replace('.entry', '.bundle');
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['js', 'jsdoc']);

gulp.task('watch', ['default'], () => {
	watch(['src/**/**.js', 'spec/**/**.js'], () => gulp.start(['default']));
});
