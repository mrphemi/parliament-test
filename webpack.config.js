const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/scripts/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: "./public",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
};
