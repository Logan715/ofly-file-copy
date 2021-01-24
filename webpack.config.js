const path = require("path");

module.exports = {
	entry: "./src/index.js",
	mode: "production",
	output: {
		filename: "file-copy.js",
		path: path.resolve(__dirname, "dist"),
	},
	target: "node",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: "/node_modules/",
				loader: "babel-loader",
			},
		],
	},
	resolve: {
		fallback: {
			path: require.resolve("path-browserify"),
			constants: require.resolve("constants-browserify"),
			stream: require.resolve("stream-browserify"),
			assert: require.resolve("assert/"),
		},
	},
};
