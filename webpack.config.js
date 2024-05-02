// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		main: "./src",
	},
	output: {
		path: "build",
		filename: "bundle.js",
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				include: __dirname + "/src",
			},
			// {
			//     test: /\.css$/,
			//     loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
			//     include: __dirname + '/src'
			// },
			{
				test: /\.css/,
				loaders: ["style", "css"],
				include: __dirname + "/src",
			},
		],
	},
	// plugins: [
	//     new ExtractTextPlugin("styles.css"),
	// ]
};

module.exports = {
	// other configuration...
	module: {
		rules: [
			// other rules...
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				use: "file-loader",
			},
		],
	},
};
