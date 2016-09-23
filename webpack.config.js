var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: __dirname + '/src/index.jsx',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"],
	},
    module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	},
	stats: {
		colors: true,
		modules: true,
		reasons: true
	}
};
