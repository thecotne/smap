module.exports = {
	entry: "./entry.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: "style!css"
		}, {
			test: /^(?!.*(bower_components|node_modules))+.+\.js$/,
			loader: 'traceur?experimental&runtime'
		}]
	}
};
