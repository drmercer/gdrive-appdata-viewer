module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname + "/public/build",
		filename: "bundle.js",
		publicPath: "/public/build/",
	}
}
